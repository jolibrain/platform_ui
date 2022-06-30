import { observable, action, computed } from "mobx";
import agent from "../agent";
import path from "path";
import moment from 'moment';

export class videoExplorerStore {
    @observable loaded = false;
    @observable settings = {};

    @observable videos = [];
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
                !this.settings.processingApiUrl
          )
            return null;

        await this.loadProcessingVideos()
    }

    async refresh() {
      if(
        !this.settings || 
        !this.settings.storageApiUrl
      )
            return null;

        await this.loadVideoPaths()
        this.loaded = true;
    }

    @action
    async loadProcessingVideos() {
        new Promise(resolve => {

            fetch(this.settings.processingApiUrl)
                .then(response => response.json())
                .then(async jsonContent => {

                  const { jobs } = jsonContent;

                  for (let index = 0; index < jobs.length; index++) {

                    const job = jobs[index];

                    if(!this.processingVideos.map(v => v.uuid).includes(job.uuid)) {

                      const videoResponse = await fetch(
                        path.join(
                          this.settings.storageApiUrl,
                          job.uuid
                        )
                      )
                      const videoJson = await videoResponse.json()

                      this.processingVideos.push({
                        ...job,
                        ...videoJson
                      });

                    } else {

                      const video = this.processingVideos
                                          .find(v => v.uuid === job.uuid);

                      if(video.status !== job.status) {
                          this.refresh();
                      }

                      video.status = job.status;
                      video.message = job.message;
                      video.date = job.date;
                    }

                  }
                })
                .catch(e => {
                    //console.log(e);
                });
        });
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
            `/data/videos/${this.selectedVideo.uuid}/${this.videoType}` : ""
    }

    @computed
    get videoPoster() {
        return "";
    }

    @computed
    get videoType() {
        return this.settings && this.settings.boundingBoxes ?
            "output/output.mp4" : `input/${this.selectedVideo.filename}`
    }

    @computed
    get selectedVideo() {
        return this.videos.find(v => v.isSelected)
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
        this.videos.forEach(v => v.isSelected = false)
        this.videos.find(v => v.filename === videoName).isSelected = true

        this.loadSelectedFrames()
    }

    @action
    setFrame(fname) {
        this.frames.forEach(f => f.isSelected = false)
        this.frames.find(f => f.fname === fname).isSelected = true
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
        const video = this.selectedVideo;
        const videoPath = `/data/videos/${video.uuid}/output/`

        const statsPath = path.join(videoPath, "stats.json");

        try {
            const statsFile = await fetch(statsPath);
            this.frames = await statsFile.json();
        } catch(e) {
            console.log("Failed to get stats.json")
            console.log(e)
        }

        if(this.frames.length > 0) {
            this.frames[0].isSelected = true;
        }

    }

    @action
    async loadVideoPaths() {
        new Promise(resolve => {

            fetch(this.settings.storageApiUrl)
              .then(response => response.json())
              .then(async storageJson => {
                    const { videos } = storageJson;

                    const filteredFolders = videos.filter(f => {
                        let keepFolder = true;

                        if (this.settings.filter) {
                            if (this.settings.filter.exclude) {
                                keepFolder = this.settings.filter.exclude.every(
                                    e => f.filepath.indexOf(e) === -1
                                );
                            }
                        }

                        // UNMAINTAINED: API change
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
                        const video = videos[index];

                        const infoPath = path.join(
                            `/data/videos/${video.uuid}/output/`,
                            "info.json"
                        )
                        const infoFile = await fetch(infoPath);
                        video.stats = await infoFile.json();

                        if(!this.videos.map(v => v.uuid).includes(video.uuid)) {
                            this.videos.push(video)
                        }
                    }
                })
                .catch(e => {
                    console.log("Exception while loading video storage")
                    console.log(e);
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
