let handPose;
let hands = [];
let video;
let platform; 

function preload(){
    let options = {
        flipped: true, 
        runtime: "tfjs" ,
        modelType: "lite",
        detectorModelUrl: undefined,
        landmarkModeUrl: undefined,
    }

    handPose = ml5.handPose(options);
}

function setup () {
    new Canvas(640, 480);

    let constraints = {
        video: {
            mandatory: {
                minWidth: width,
                minHeight: height
            },
            optional: [{minFrameRate: 60}]
        },
        audio: false,
        flipped: false,
    };  

    video = createCapture(constraints);
    video.size(width, height);
    video.hide();

    handPose.detectStart(video, gotHands);

    // 13 & 14. Create a platform sprite and set its collider to "static"
    platform = new Sprite(width / 2, height / 2, 300, 20);
    platform.collider = "static";
}

function gotHands(results){
    hands = results;
}

function draw () {
    background("black");

    // 1, 2 & 3. Mirror and display the webcam video to fill the entire canvas
    push();
    scale(-1, 1);
    image(video, -width, 0, width, height);
    pop();

    // 4. Loop through each hand and each keypoint to draw a circle (diameter: 30)
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        
        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            fill(0, 255, 0);
            noStroke();
            circle(keypoint.x, keypoint.y, 30);
        }

        // 15. Make the platform sprite follow the x and y position of your thumb
        if (hand.thumb_tip) {
            platform.x = hand.thumb_tip.x;
            platform.y = hand.thumb_tip.y;
        }
    }
}

