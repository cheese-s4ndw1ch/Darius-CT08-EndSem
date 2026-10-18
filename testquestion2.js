let handPose;
let hands = [];
let video;
let platform; 
let ball;     
let points = 0; 

function preload(){
    let options = {
        flipped: true,
        runtime: "tfjs",
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

   
    world.gravity.y = 10;

  
    platform = new Sprite(width / 2, height / 2, 300, 20);
    platform.collider = "static";

    
    ball = new Sprite(320, 100, 40);
    ball.bounciness = 1;
    ball.collider = "static";
}

function gotHands(results){
    hands = results;
}

function draw () {
    background("black");

   
    push();
    scale(-1, 1);
    image(video, -width, 0, width, height);
    pop();

    // Loop through each hand and each keypoint to draw a circle (diameter: 30)
    for (let i = 0; i < hands.length; i++) {
        let hand = hands[i];
        
        for (let j = 0; j < hand.keypoints.length; j++) {
            let keypoint = hand.keypoints[j];
            fill(0, 255, 0);
            noStroke();
            circle(keypoint.x, keypoint.y, 30);
        }

       
        if (hand.thumb_tip) {
            platform.x = hand.thumb_tip.x;
            platform.y = hand.thumb_tip.y;
        }
    }

   
    if (mouse.presses()) {
        ball.collider = "dynamic";
    }

    
    if (ball.collides(platform)) {
        points++;
    }

    
    fill(255);
    textSize(20);
    text("Points: " + points, 20, 30);
}
