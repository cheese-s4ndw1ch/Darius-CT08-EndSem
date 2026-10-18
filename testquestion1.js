

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

    /
    push();
    scale(-1, 1);
    image(video, -width, 0, width, height);
    pop();

   
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
}
