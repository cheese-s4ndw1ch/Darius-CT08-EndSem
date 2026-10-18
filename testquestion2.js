let handPose;
let hands = [];
let video;
let platform; // Platform sprite from Part A
let ball;     // Ball sprite
let points = 0; // Point counter starting at 0

function preload(){
    let options = {
        flipped: true, // Correctly mirror the hand pose model
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

    // 5. Apply gravity so that the ball sprite falls downward
    world.gravity.y = 10;

    // Create the platform sprite (static)
    platform = new Sprite(width / 2, height / 2, 300, 20);
    platform.collider = "static";

    // 1, 2 & 3. Create a new ball sprite at x: 320, y: 100, diameter: 40, set bounciness to 1, and collider to "static"
    ball = new Sprite(320, 100, 40);
    ball.bounciness = 1;
    ball.collider = "static";
}

function gotHands(results){
    hands = results;
}

function draw () {
    background("black");

    // Mirror and display the webcam video to fill the entire canvas
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

    // 4. When the mouse is clicked, change the ball sprite collider to "dynamic"
    if (mouse.presses()) {
        ball.collider = "dynamic";
    }

    // 8. Whenever the ball sprite collides with the platform sprite, add 1 point
    if (ball.collides(platform)) {
        points++;
    }

    // 6 & 7. Display points on the top of the screen as "Points: [point number]"
    fill(255);
    textSize(20);
    text("Points: " + points, 20, 30);
}
