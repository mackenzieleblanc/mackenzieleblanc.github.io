
window.onload = function () {

    //////////////////////////////////////////////////////////////////
    /////////////////// SETUP ///////////////////////////////
    //////////////////////////////////////////////////////////////////

    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    const maxSpeed = 30
    const walkAccelerationForward = 2.5
    const walkAccelerationBackwards = 1.9
    const playerJumpStrength = 35
    const gravity = 1

    var player1HurtBoxCoors = [240, 400]
    var player1HurtBoxVolume = [280, 550]
    var player2HurtBoxCoors = [1140, 400]
    var player2HurtBoxVolume = [200, 550] 

    var character1 = {
        topCoor: player1HurtBoxCoors[1],
        leftCoor: player1HurtBoxCoors[0] - 40,
        width: 550,
        height: 550,
        hitboxend: 375,
        velocityX: 0,
        velocityY: 0,
        hitboxL: [545, 518],
        hitboxM: [350, 470],
        hitboxH: [350, 430],
        facingRight: true,
        facingLeft: false,
        moveRight: false,
        moveLeft: false,
        jump: false,
        playerOnGround: true,
        sprite: document.getElementById("character1"),
        lightAttack: false,
        mediumAttack: false,
        heavyAttack: false,
        idleSprite: 595,
        collisionOnPlayerTwo: false,
        currentAnimationType: "idle",
        animationFrame: 6,
        animateTopCoor: 0,
        attackFrameLight: 0,
        numberOfJumps: 0,
    }
    ///leftCoor: 1100 player 2
    ///leftCoor: 200 player 1
    var character2 = {
        topCoor: 400,
        leftCoor: 1100,
        width: 350,
        height: 550,
        velocityX: 0,
        velocityY: 0,
        hitboxL: [545, 518],
        hitboxM: [925, 470],
        hitboxH: [765, 490],
        facingRight: false,
        facingLeft: true,
        moveRight: false,
        moveLeft: false,
        jump: false,
        playerOnGround: true,
        sprite: document.getElementById("character2"),
        lightAttack: false,
        mediumAttack: false,
        heavyAttack: false,
        idleSprite: 385,
        collisionOnPlayerOne: false,
        currentAnimationType: "idle",
    }

    var directionLeft = 30
    var friction = 1.5
    var anyKeyPress = false
    var jumpTimer = 0
    var frameIndex = 0
    var character1idle = 595
    var count = 0
    var attackFrameLight = 0
    var attackFrameMedium = 0
    var attackFrameHeavy = 0



    setInterval(main, 30);

    document.addEventListener("keydown", keyDownPress)
    document.addEventListener("keyup", keyUpPress)
    document.addEventListener("keydown", attackDown)
    document.addEventListener("keyup", upAttack)
    document.addEventListener("keydown", hideHitbox)

    //////////////////////////////////////////////////////////////////
    /////////////////// CORE LOGIC ///////////////////////////////
    //////////////////////////////////////////////////////////////////

    function main() {
        ctx.clearRect(0, 0, 2000, 2000)
        frictionAndGravity()
        player1HurtBoxCoors[0] = player1HurtBoxCoors[0] + character1.velocityX
        player1HurtBoxCoors[1] = player1HurtBoxCoors[1] + character1.velocityY

        character1.leftCoor = character1.leftCoor + character1.velocityX
        character1.topCoor = character1.topCoor + character1.velocityY
       
        character2.leftCoor = character2.leftCoor + character2.velocityX
        character2.topCoor = character2.topCoor + character2.velocityY
        player2HurtBoxCoors[0] = player2HurtBoxCoors[0] + character2.velocityX
        player2HurtBoxCoors[1] = player2HurtBoxCoors[1] + character2.velocityY
        character1.hitboxL[0] = character1.hitboxL[0] + character1.velocityX //// LOOK AT LATER
        character1.hitboxL[1] = character1.hitboxL[1] + character1.velocityY

        //ctx.drawImage(character1.sprite, 100, 100, 100,100) 
        collision()
        keyboardControlActions()
        changeAnimationType()
        animate()
        ///debug()
        drawCharacter()
        attack()
        debugMovement()
    }

    //////////////////////////////////////////////////////////////////
    /////////////////// HELPER FUNCTIONS ///////////////////////////////
    //////////////////////////////////////////////////////////////////



    function debugMovement() {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black"
        ctx.fillText("c1.left:" + character1.moveLeft + " c1.right:" + character1.moveRight + " c1.velx:" + character1.velocityX + " jumpTimer:" + jumpTimer + " c1.leftCoor plus width: " + (character1.leftCoor + character1.width) + " c1.hurtbox: " + player1HurtBoxCoors[0], 100, 100)
        ctx.fillText("c2.left:" + character2.moveLeft + " c2.right:" + character2.moveRight + " c2.velx:" + character2.velocityX + " c2.leftCoor plus width: " + (character2.leftCoor + character2.width), 100, 150)

    }





    function hideHitbox(e) {
        anyKeyPress = true
        if (e.key === "t") {
            document.getElementById("hitboxHchr1").style.opacity = 0;
            document.getElementById("hitboxMchr1").style.opacity = 0;
            document.getElementById("hitboxLchr1").style.opacity = 0;

        }
        if (e.key === "1") {
            document.getElementById("hitboxLchr1").style.opacity = 100;
        }
        if (e.key === "2") {
            document.getElementById("hitboxMchr1").style.opacity = 100;
        }
        if (e.key === "3") {
            document.getElementById("hitboxHchr1").style.opacity = 100;
        }
    }

    function changeAnimationType() {
        if (character1.currentAnimationType === "idle") {
            character1.animationFrame = 6
            character1.animateTopCoor = 0
        } else if (character1.currentAnimationType === "punch") {
            character1.animationFrame = 3
            character1.animateTopCoor = 576
            return character1idle = 595
        } else if (character1.currentAnimationType === "kick") {
            console.log("insert kick animation here")
            character1.animationFrame = 5
            character1.animateTopCoor = 1152
        } else if (character1.currentAnimationType === "special") {
            console.log("insert special animation here")
        }

        if (jumpTimer > 0 && !character1.playerOnGround) {
            character1.currentAnimationType = "jump"
            jumpTimer--
        } else {
            jumpTimer = 0
            if (Math.abs(character1.velocityX) > 0) {//if you're moving then change animation to walking or running
                if (character1.moveLeft || character1.moveRight) {
                    character1.currentAnimationType = "run"
                } else if (character1.playerOnGround) {
                    if (character1.currentAnimationType !== "idle") {
                        character1.currentAnimationType = "idle"
                        // }
                    }
                }
            }
        }
    }

    function animate() {
        count = count + 1 / 6
        character1idle = character1.idleSprite * Math.floor(count % character1.animationFrame)
        ///return character1idle

    }

    function drawCharacter() {
        ctx.fillStyle = "#AAF6BD";
        ctx.fillRect(player1HurtBoxCoors[0], player1HurtBoxCoors[1], player1HurtBoxVolume[0], player1HurtBoxVolume[1]);
        ctx.fillStyle = "#FBC3D9";
        ctx.fillRect(player2HurtBoxCoors[0], player2HurtBoxCoors[1], player2HurtBoxVolume[0], player2HurtBoxVolume[1]);

        if (character1.leftCoor + character1.width < character2.leftCoor + character2.width) {
            character1.hitboxL[0] = character1.leftCoor + player1HurtBoxVolume[0] + 70
            player2HurtBoxCoors[0] = character2.leftCoor + 40
            player1HurtBoxCoors[0] = character1.leftCoor + 40

            ctx.drawImage(character1.sprite, character1idle, character1.animateTopCoor, 595, 577, player1HurtBoxCoors[0] - 40, player1HurtBoxCoors[1], character1.width, character1.height);
            ctx.save();
            ctx.scale(-1, 1); //mirror the entire canvas
            ctx.drawImage(character2.sprite, character2.idleSprite * Math.floor(count % 6), 0, 385, 577, -player2HurtBoxCoors[0] + 40 - character2.width, character2.topCoor, character2.width, character2.height);
            ctx.restore();//put the canvas back to normal

        } else if (character1.leftCoor + character1.width > character2.leftCoor + character2.width) {
            character1.hitboxL[0] = character1.leftCoor + 125
            player2HurtBoxCoors[0] = character2.leftCoor + 110
            player1HurtBoxCoors[0] = character1.leftCoor + 250
            ctx.save();
            ctx.scale(-1, 1); //mirror the entire canvas
            ctx.drawImage(character1.sprite, character1idle, character1.animateTopCoor, 595, 577, -player1HurtBoxCoors[0] + 250 - character1.width, player1HurtBoxCoors[1], character1.width, character1.height);
            ctx.restore();//put the canvas back to normal
            ctx.drawImage(character2.sprite, character2.idleSprite * Math.floor(count % 6), 0, 385, 577, player2HurtBoxCoors[0] - 110, player2HurtBoxCoors[1], character2.width, character2.height);

        }
        ///ctx.drawImage(character2.sprite, 500, 400, 300, 300);

        ///img, sx, sy, swidth, sheight, x, y, width, height
        ///img, 69, 137, 100, 300, 350, 400, 300, 300
        /// ctx.drawImage(character1.sprite, 350, 400, 300, 300);

    }

    function frictionAndGravity() {
        /// character1.leftCoor = character1.velocityX + character1.leftCoor
        /// character2.leftCoor = character2.velocityX + character2.leftCoor



        if (character1.velocityX > maxSpeed) { //limits speed to maxSpeed
            character1.velocityX = maxSpeed
        }

        if (character1.velocityX < -maxSpeed) { //limits speed to maxSpeed
            character1.velocityX = -maxSpeed
        }

        //friction
        if (Math.abs(character1.velocityX) < 1) { //this makes sure that the player actually stops when the speed gets low enough
            //otherwise if you just always reduce speed it will just end up jiggling
            character1.velocityX = 0
        }
        else if (character1.velocityX > 0) {
            character1.velocityX = character1.velocityX - friction
        } else {
            character1.velocityX = character1.velocityX + friction
        }

        if (character1.playerOnGround === false) {
            character1.velocityY = character1.velocityY + gravity
        }

        if (character2.velocityX > maxSpeed) { //limits speed to maxSpeed
            character2.velocityX = maxSpeed
        }

        if (character2.velocityX < -maxSpeed) { //limits speed to maxSpeed
            character2.velocityX = -maxSpeed
        }

        //friction
        if (Math.abs(character2.velocityX) < 1) { //this makes sure that the player actually stops when the speed gets low enough
            //otherwise if you just always reduce speed it will just end up jiggling
            character2.velocityX = 0
        }
        else if (character2.velocityX > 0) {
            character2.velocityX = character2.velocityX - friction
        } else {
            character2.velocityX = character2.velocityX + friction
        }


        if (character2.playerOnGround === false) {
            character2.velocityY = character2.velocityY + gravity
        }

    }

    function keyDownPress(e) {
        anyKeyPress = true
        if (e.key === "d") {
            character1.moveRight = true
        }
        if (e.key === "a") {
            character1.moveLeft = true
        }
        if (e.key === "w") {
            character1.jump = true
        }
        if (e.key === "j") {
            character2.moveLeft = true
        }
        if (e.key === "l") {
            character2.moveRight = true
        }
        if (e.key === "i") {
            character2.jump = true
        }
    }

    function keyUpPress(e) {
        if (e.key === "d") {
            character1.moveRight = false
        }
        if (e.key === "a") {
            character1.moveLeft = false
        }
        if (e.key === "w") {
            character1.jump = false
        }
        if (e.key === "j") {
            character2.moveLeft = false
        }
        if (e.key === "l") {
            character2.moveRight = false
        }
        if (e.key === "i") {
            character2.jump = false
        }
    }


    function keyboardControlActions() {
        anyKeyPress = false //keyboardHandler will set this to true if you press any key. setting the variable to false here makes sure that key press dosen't stick around.
        //this is used for respawning, basicly if you hit any key after you die this variable will be set to true and you will respawn. 

        if (character1.moveLeft && player1HurtBoxCoors[0] < player2HurtBoxCoors[0] && !character1.collisionOnPlayerTwo && !character2.collisionOnPlayerOne) {
            ///if player 1 is moving left and is on the left side of screen
            character1.velocityX -= walkAccelerationBackwards
            character2.velocityX
        } else if (character1.moveLeft && player1HurtBoxCoors[0] > player2HurtBoxCoors[0] && !character1.collisionOnPlayerTwo && !character2.collisionOnPlayerOne) {
            ///if player 1 is moving left and is on the left side of screen
            character1.velocityX -= walkAccelerationForward
        }
        if (character1.moveRight && player1HurtBoxCoors[0] < player2HurtBoxCoors[0] && !character1.collisionOnPlayerTwo && !character2.collisionOnPlayerOne) {
            ///if player 1 is moving right and is on the right side of screen
            character1.velocityX += walkAccelerationForward
        } else if (character1.moveRight && player1HurtBoxCoors[0] > player2HurtBoxCoors[0] && !character1.collisionOnPlayerTwo && !character2.collisionOnPlayerOne) {
            ///if player 1 is moving right and is on the right side of screen
            character1.velocityX += walkAccelerationBackwards
        }
        if (character1.jump) {
            if (character1.playerOnGround) { //this only lets you jump if you are on the ground
                character1.velocityY = character1.velocityY - playerJumpStrength
                jumpTimer = 19 //this counts how many frames to have the jump last. 
                character1.playerOnGround = false //bug fix for jump animation, you have to change this or the jump animation doesn't work
                frameIndex = 4
            }
        }
        // if (character2.moveLeft && player2HurtBoxCoors[0] > player1HurtBoxCoors[0] && !character1.collisionOnPlayerTwo && !character2.collisionOnPlayerOne) {
        //     character2.velocityX -= walkAccelerationForward
        // }
        // if (character2.moveRight) {
        //     character2.velocityX += walkAccelerationForward
        // }
        if (character2.jump) {
            if (character2.playerOnGround) { //this only lets you jump if you are on the ground
                character2.velocityY = character2.velocityY - playerJumpStrength
                jumpTimer = 19 //this counts how many frames to have the jump last. 
                character2.playerOnGround = false //bug fix for jump animation, you have to change this or the jump animation doesn't work
                frameIndex = 4
                //// FOR SOME REASON THIS IS ALWAYS TRIGGERED WHEN CHARACTER 2 HITS THE GROUND?
            }
        }
    }

    function collision() {
        ///if (character1.leftCoor + character1.hitboxend >= character2.leftCoor && character1.leftCoor + character1.width <= character2.leftCoor + character2.width) {
        ///  character1.collisionOnPlayerTwo = true
        ///  if (character1.jump && character1.topCoor + character1.height <= character2.topCoor) {
        ///    character1.collisionOnPlayerTwo = true
        ///  }
        ///} else if (character2.leftCoor + character2.width >= character1.leftCoor && character2.leftCoor + character2.width <= character1.leftCoor + character1.width && character2.topCoor + character2.height <= character1.topCoor) {
        ///  character2.collisionOnPlayerOne = true
        ///}
        ///resolveCollisionBetweenPlayers()
        // if (character1.moveLeft || character1.moveRight) {
        if (player1HurtBoxCoors[0] + player1HurtBoxVolume[0] > player2HurtBoxCoors[0]) {
            if (player1HurtBoxCoors[0] < player2HurtBoxCoors[0] + player2HurtBoxVolume[0]) {
                if (player1HurtBoxCoors[1] < player2HurtBoxCoors[1] + player2HurtBoxVolume[1]) {
                    if (player1HurtBoxCoors[1] + player1HurtBoxVolume[1] > player2HurtBoxCoors[1]) {
                        resolveCollisionOnPlayerTwo(player1HurtBoxCoors, player1HurtBoxVolume, player2HurtBoxCoors, player2HurtBoxVolume, character1)
                        resolveCollisionOnPlayerOne(player1HurtBoxCoors, player1HurtBoxVolume, player2HurtBoxCoors, player2HurtBoxVolume, character2)
                        character1.collisionOnPlayerTwo = true
                        character2.collisionOnPlayerOne = true
                        // resolveCollisionBetweenPlayersSimple(player1HurtBoxCoors, player1HurtBoxVolume, player2HurtBoxCoors, player2HurtBoxVolume, character1, character2)
                        ///alert("BOOOO")
                    }
                }
            }
        }
        //  }
        // if (character2.moveLeft || character2.moveRight) {
        //     if (player1HurtBoxCoors[0] + player1HurtBoxVolume[0] > player2HurtBoxCoors[0]) {
        //         if (player1HurtBoxCoors[0] < player2HurtBoxCoors[0] + player2HurtBoxVolume[0]) {
        //             if (player1HurtBoxCoors[1] < player2HurtBoxCoors[1] + player2HurtBoxVolume[1]) {
        //                 if (player1HurtBoxCoors[1] + player1HurtBoxVolume[1] > player2HurtBoxCoors[1]) {
        //                     resolveCollisionOnPlayerOne(player1HurtBoxCoors, player1HurtBoxVolume, player2HurtBoxCoors, player2HurtBoxVolume, character2)
        //                     //resolveCollisionBetweenPlayersSimple(player1HurtBoxCoors, player1HurtBoxVolume, player2HurtBoxCoors, player2HurtBoxVolume, character1, character2)
        //                     ///alert("BOOOO")
        //                 }
        //             }
        //         }
        //     }
        // }
        if (character1.topCoor > 400 || player1HurtBoxCoors[1] > 400) {
            character1.topCoor = 400
            player1HurtBoxCoors[1] = 400
            character1.hitboxL[1] = 518
            player1HurtBoxVolume[1] = character1.height
            character1.playerOnGround = true
        }
        if (character1.leftCoor > 1400) {
            character1.leftCoor = 1400
            player1HurtBoxCoors[0] = 1650
            character1.hitboxL[0] = 1947
        } else if (character1.leftCoor < 0) {
            character1.leftCoor = 0
            player1HurtBoxCoors[0] = 40
            character1.hitboxL[0] = 344

        }
        if (character2.topCoor > 400 || player2HurtBoxCoors[1] > 400) {
            character2.topCoor = 400
            player2HurtBoxCoors[1] = 400
            player2HurtBoxVolume[1] = character2.height
            character2.playerOnGround = true
        }
        if (character2.leftCoor > 1600) {
            character2.leftCoor = 1600
            player2HurtBoxCoors[0] = 1640
        } else if (character2.leftCoor <= 0) {
            character2.leftCoor = 0
            player2HurtBoxCoors[0] = 110
        }

        var result = undefined


    }

    function resolveCollisionOnPlayerTwo(player1Coors, player1Volume, player2Coors, player2Volume, player1) {
        //this is the return value
        let collisionDirectionCharacter1 = ""
        //found here https://stackoverflow.com/questions/38648693/resolve-collision-of-two-2d-elements
        //first we find the distance between the center of the object and the player
        let dxcharacter1 = (player1Coors[0] + (player1Volume[0] / 2)) - (player2Coors[0] + (player2Volume[0] / 2))
        let dycharacter1 = (player1Coors[1] + (player1Volume[1] / 2)) - (player2Coors[1] + (player2Volume[1] / 2))

        //get half widths of each item
        //i'm honestly not 100% certian why this step is in there, but it works.
        let halfWidthCharacter1 = (player1Volume[0] / 2) + (player2Volume[0] / 2)
        let halfHeightCharacter1 = (player1Volume[1] / 2) + (player2Volume[1] / 2)

        // if the x and y vector are less than the half width or half height,
        // they we must be inside the object, causing a collision
        //         if (Math.abs(dx) <= halfWidth) {
        // if (Math.abs(dy) <= halfHeight) {
        //what side are we colliding on?
        let originxCharacter1 = halfWidthCharacter1 - Math.abs(dxcharacter1)
        let originyCharacter1 = halfHeightCharacter1 - Math.abs(dycharacter1)

        //player 1 priority
        if (originxCharacter1 >= originyCharacter1) {
            if (dycharacter1 > 0) {                    //bottom collision
                collisionDirectionCharacter1 = 'bottom'
                player1Coors[1] = player1Coors[1] + originyCharacter1 + 1
                player1.velocityY = 0
            } else {                         //top collision
                collisionDirectionCharacter1 = 'top'
                player1Coors[1] = player1Coors[1] - originyCharacter1
                player1.velocityY = 0
                playerOnGround = true
            }
        } else {
            if (dxcharacter1 > 0) {                    //left collision
                collisionDirectionCharacter1 = 'left'
                player1Coors[0] = player1Coors[0] + originxCharacter1
                player1.velocityX = 0
            } else {                        //right collision
                collisionDirectionCharacter1 = 'right'
                player1Coors[0] = player1Coors[0] - originxCharacter1
                player1.velocityX = 0
            }
        }

        return collisionDirectionCharacter1

    }

    function resolveCollisionOnPlayerOne(player1Coors, player1Volume, player2Coors, player2Volume, player2) {
        //this is the return value
        let collisionDirectionCharacter2 = ""
        //found here https://stackoverflow.com/questions/38648693/resolve-collision-of-two-2d-elements
        //first we find the distance between the center of the object and the player
        let dxcharacter2 = (player2Coors[0] + (player2Volume[0] / 2)) - (player1Coors[0] + (player1Volume[0] / 2))
        let dycharacter2 = (player2Coors[1] + (player2Volume[1] / 2)) - (player1Coors[1] + (player1Volume[1] / 2))

        //get half widths of each item
        //i'm honestly not 100% certian why this step is in there, but it works.
        let halfWidthCharacter2 = (player2Volume[0] / 2) + (player1Volume[0] / 2)
        let halfHeightCharacter2 = (player2Volume[1] / 2) + (player1Volume[1] / 2)

        // if the x and y vector are less than the half width or half height,
        // they we must be inside the object, causing a collision
        //         if (Math.abs(dx) <= halfWidth) {
        // if (Math.abs(dy) <= halfHeight) {
        //what side are we colliding on?
        let originxCharacter2 = halfWidthCharacter2 - Math.abs(dxcharacter2)
        let originyCharacter2 = halfHeightCharacter2 - Math.abs(dycharacter2)


        //player 2 priority
        if (originxCharacter2 > originyCharacter2) {
            if (dycharacter2 > 0) {                    //bottom collision
                collisionDirectionCharacter2 = 'bottom'
                player2Coors[1] = player2Coors[1] + originyCharacter2 + 1
                player2.velocityY = 0
            } else {                         //top collision
                collisionDirectionCharacter2 = 'top'
                player2Coors[1] = player2Coors[1] - originyCharacter2
                player2.velocityY = 0
                playerOnGround = true
            }
        } else {
            if (dxcharacter2 > 0) {                    //left collision
                collisionDirectionCharacter2 = 'left'
                player2Coors[0] = player2Coors[0] + originxCharacter2
                player2.velocityX = 0
            } else {                        //right collision
                collisionDirectionCharacter2 = 'right'
                player2Coors[0] = player2Coors[0] - originxCharacter2
                player2.velocityX = 0
            }

        }
        return collisionDirectionCharacter2

    }



    function attackDown(e) {
        if (e.key === "c") {
            character1.lightAttack = true
            character1.currentAnimationType = "punch"
        }
        if (e.key === "x") {
            character1.mediumAttack = true
            character1.currentAnimationType = "kick"
        }
        if (e.key === "z") {
            character1.heavyAttack = true
            character1.currentAnimationType = "special"
        }
        if (e.key === "n") {
            character2.lightAttack = true
        }
        if (e.key === "m") {
            character2.mediumAttack = true
        }
        if (e.key === ",") {
            character2.heavyAttack = true
        }
    }

    function upAttack(e) {
        if (e.key === "c") {
            character1.lightAttack = false
            character1.currentAnimationType = "idle"
        }
        if (e.key === "x") {
            character1.mediumAttack = false
            character1.currentAnimationType = "idle"
        }
        if (e.key === "z") {
            character1.heavyAttack = false
            character1.currentAnimationType = "idle"
        }
        if (e.key === "n") {
            character2.lightAttack = false
        }
        if (e.key === "m") {
            character2.mediumAttack = false
        }
        if (e.key === ",") {
            character2.heavyAttack = false
        }
    }

    function attack() {
        if (character1.lightAttack) {
            //alert("character 1 light attack!! ^~^")
            if (character1idle >= 595) {
                ctx.beginPath();
                ctx.rect(character1.hitboxL[0], character1.hitboxL[1], 80, 70);
                ctx.stroke();
                ctx.lineWidth = "2";
                ctx.strokeStyle = "green";
            }
        } else if (character1.mediumAttack) {
            ctx.beginPath();
            ctx.rect(345, 466, 200, 150);
            ctx.stroke();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "orange";
            //alert("character 1 medium attack!!!11!1! owo")
        } else if (character1.heavyAttack) {
            ctx.beginPath();
            ctx.rect(344, 425, 270, 240);
            ctx.stroke();
            ctx.lineWidth = "2";
            ctx.strokeStyle = "red";
            //alert("character 1 heavy attack.")
        }
    }

    function debug() {
        console.log("blah")
    }

}