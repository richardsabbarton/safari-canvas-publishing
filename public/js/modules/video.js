


class VideoController {
    constructor(){
        this.apiKey = "47807831"
        this.token = false
        this.sessionId = false
        this.subscribers = new Array()
    }

    connect(room){
        return new Promise((resolve, reject)=>{
            console.log("Getting Session and Token for room: ", room)
            fetch('https://neru-68eeb4cf-video-server-live.euw1.runtime.vonage.cloud/session/47807831/' + room).then(function fetch(res) {
                return res.json()
            }).then((json)=>{
                //json = JSON.parse(json)
                console.log(json)
                this.apiKey = json.apiKey
                this.sessionId = json.sessionId
                this.token = json.token
                this.connectVideoSession()
                .then(()=>{
                    resolve()
                })
            }).catch(function catchErr(error) {
                console.log(error);
                console.log('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
                reject(error)
            })
        })
            
    }

    connectVideoSession(){
        return new Promise((resolve, reject)=>{
            this.session = OT.initSession(this.apiKey, this.sessionId);
            // next line for easy JS console access
            window.session = this.session
            this.session.connect(this.token,(error)=>{
                if(error){
                    console.log(error)
                    reject(error)
                } else {
                    this.sessionConnected = true
                    resolve(this.session)
                }
            })

            this.session.on("streamCreated", (event)=>{
                const subscriberOptions = {
                    width: 1280,
                    height: 720,
                    //preferredResolution: {width: 1280, height: 720},
                }
                let subscriber = this.session.subscribe(event.stream, "subscriber", subscriberOptions)
                //this.subscribers.push(subscriber)
                document.getElementById("subscriber").style.display = "block"
            })
        })
            

    }

    publishCanvas(canvas){
        let publisherOptions = {
            insertMode: "none",     // Canvas already on screen
            showDefaultUI: false,   // We'll use our own if needed
            audioSource: null,      // no audio
            publishAudio: false,
            videoContentHint: "text",   // prefer resolution over framerate
            videoSource: canvas.captureStream(30).getVideoTracks()[0]
        }
        this.publisher = OT.initPublisher(null, publisherOptions)
        // for easy console access
        window.publisher = this.publisher
        this.session.publish(this.publisher)
    }

    subscribe(){

    }
}


export {VideoController}