import { observable, action, computed } from "mobx";
import agent from "../agent";
import path from "path";
import { nanoid } from 'nanoid';
import moment from 'moment';

export class videoExplorerStore {
    @observable loaded = false;
    @observable settings = {};

    @observable videoPaths = [];
    @observable frames = [];

    @observable processingVideos = [];

    @action
    setup(configStore) {
        this.settings = configStore.videoExplorer;
        this.updateProcessingVideos();
        setInterval(this.updateProcessingVideos.bind(this), 10000)
    }

    @action
    toggleBoundingBoxes() {
        this.settings.boundingBoxes = !this.settings.boundingBoxes;
    }

    async updateProcessingVideos() {
        if(
            !this.settings ||
                !this.settings.rootPath ||
                !this.settings.videoProcessingJson
          )
            return null;

        await this.loadProcessingVideos(this.settings.videoProcessingJson)
    }

    async refresh() {

        if(
            !this.settings ||
                !this.settings.rootPath
          )
            return null;

        await this.loadVideoPaths(this.outputFolderPath)
        this.loaded = true;
    }

    @action
    async loadProcessingVideos(jsonPath) {
        new Promise(resolve => {

            this.$reqFile(jsonPath)
                .then(async jsonContent => {

                    const videoTitles = Object.keys(jsonContent.videos)

                    for (let index = 0; index < videoTitles.length; index++) {

                        const videoTitle = videoTitles[index];

                        if(!this.processingVideos.map(v => v.title).includes(videoTitle)) {

                            this.processingVideos.push({
                                id: nanoid(),
                                title: videoTitle,
                                status: jsonContent.videos[videoTitle].status,
                                message: jsonContent.videos[videoTitle].message
                            });

                        } else {

                            const video = this.processingVideos
                                              .find(v => v.title === videoTitle);

                            video.status = jsonContent.videos[videoTitle].status;
                            video.message = jsonContent.videos[videoTitle].message;

                        }
                    }
                })
                .catch(e => {
                    //console.log(e);
                });
        });
    }

    $reqFolder(rootPath) {
        return agent.Webserver.listFolders(rootPath);
    }

    $reqFile(path) {
        return agent.Webserver.getFile(path);
    }

    @computed
    get outputFolderPath() {
        return path.join(this.settings.rootPath, this.settings.folders.output)
    }

    @computed
    get feedbacksFolderPath() {
        return path.join(this.settings.rootPath, this.settings.folders.feedbacks)
    }

    @computed
    get videoSrc() {
        return this.selectedVideo ?
            `${this.selectedVideo.path}${this.videoType}` : ""
    }

    @computed
    get videoPoster() {
        return "";
    }

    @computed
    get videoType() {
        return this.settings && this.settings.boundingBoxes ?
            "output_bbox.mp4" : "output.mp4"
    }

    @computed
    get selectedVideo() {
        return this.videoPaths.find(v => v.isSelected)
    }

    @computed
    get selectedFrame() {

        if(!this.frames || this.frames.length === 0)
            return null;
               
        return this.frames.find(f => f && f.isSelected)
    }

    @action
    setVideoPath(videoName) {
        this.frames = []
        this.videoPaths.forEach(v => v.isSelected = false)
        this.videoPaths.find(v => v.name === videoName).isSelected = true

        this.loadSelectedFrames()
    }

    @action
    setFrame(frameId) {
        this.frames.forEach(f => f.isSelected = false)
        this.frames.find(f => f.id === frameId).isSelected = true
    }

    @action
    setFrameIndex(frameIndex) {
        this.frames.forEach(f => f.isSelected = false)

        if(frameIndex >= this.frames.length)
            frameIndex = this.frames.length - 1;

        if(this.frames[frameIndex])
            this.frames[frameIndex].isSelected = true
    }

    @action
    async loadSelectedFrames() {
        const thumbFolder = this.settings.folders.thumbs;

        const videoPath = this.selectedVideo.path;
        const videoFiles = await agent.Webserver.listFiles(videoPath);

        const statsPath = path.join(videoPath, "stats.json");
        const stats = await agent.Webserver.getFile(statsPath);
        const indexedStats = stats.reduce(function(map, obj) {
            map[obj.fname.split('/').pop()] = obj;
            return map;
        }, {});

        const jsonFiles = videoFiles
              .filter(jsonFile => /^frame.*\.json$/.test(jsonFile))

        const buildFrame = (jsonFile) => {
            const regexpFrame = /(\d+)\.json$/;
            const match = jsonFile.match(regexpFrame);

            if(match) {
                const frameIndex = match[1]
                return {
                    id: nanoid(),
                    isSelected: false,
                    index: parseInt(frameIndex),
                    jsonFile: jsonFile,
                    imageSrc: {
                        'original': `${videoPath}frame${frameIndex}.png`,
                        'thumb': `${videoPath}${thumbFolder}frame${frameIndex}.png`,
                    },
                    stats: indexedStats[`frame${frameIndex}.png`]
                }
            } else {
                return null;
            }
        }

        this.frames = jsonFiles
            .map(buildFrame)

        if(this.frames.length > 0) {
            this.frames[0].isSelected = true;
        }

    }

    @action
    async loadVideoPaths(rootPath) {
        new Promise(resolve => {

            this.$reqFolder(rootPath)
                .then(async content => {
                    const { folders } = content;

                    const filteredFolders = folders.filter(f => {
                        let keepFolder = true;

                        if (this.settings.filter) {
                            if (this.settings.filter.exclude) {
                                keepFolder = this.settings.filter.exclude.every(
                                    e => f.href.indexOf(e) === -1
                                );
                            }
                        }

                        //
                        // Uncomment following section if you need to debug filter
                        //
                        // if (!keepFolder)
                        //   console.log(
                        //     "dataRepositoriesStore - load - folder filtered out: " +
                        //       rootPath +
                        //       " - " +
                        //       f.href
                        //   );

                        return keepFolder;
                    });

                    for (let index = 0; index < filteredFolders.length; index++) {
                        const folder = filteredFolders[index];
                        const fPath = path.join(rootPath, folder.href, "/");
                        const fLabel = fPath.replace(new RegExp(this.settings.nginxPath, "gm"), "");

                        const infoFile = await fetch(path.join(fPath, "info.json"));
                        const infoJson = await infoFile.json();

                        if(!this.videoPaths.map(v => v.name).includes(folder.name)) {
                            this.videoPaths.push({
                                id: nanoid(),
                                name: folder.name,
                                path: fPath,
                                label: fLabel,
                                frames: [],
                                stats: infoJson
                            });
                        }
                    }
                })
                .catch(e => {
                    //console.log(e);
                });
        });
    }

    @action
    writeFeedback(feedbackContent) {

        // Check if feedbackPath is set
        if(
            !this.settings &&
                !this.settings.feedbackPath
        )
            return false;

        const timestamp = moment().unix();

        let feedbackFilename =
            `${this.selectedVideo.name.replace(/\s+/gi, '_')}_`;

        feedbackFilename += this.selectedFrame ?
            `frame${this.selectedFrame.index}_` : ''

        feedbackFilename += `${timestamp}.json`

        const feedbackPath = path.join(
            '/filebrowser/api/resources',
            this.settings.feedbackPath,
            feedbackFilename
        );

        return agent.Webserver.writePathContent(
            feedbackPath,
            `{"content": "${feedbackContent}", "timestamp": ${timestamp}}`
        )
    }
}

export default new videoExplorerStore();
