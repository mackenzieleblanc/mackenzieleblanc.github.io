
window.onload = function () {


    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    const maxSpeed = 30
    const walkAccelerationForward = 2.5

    var player = {
        x: 200,
        y: 200,
        width: 100,
        height: 100,
        moveRight: false,
        moveLeft: false,
        moveUp: false,
        moveDown: false,
        attackRight: false,
        attackLeft: false,
        attackUp: false,
        attackDown: false,
        onGround: false,
    }
    var previousTotalTimeElapsed = 0
    var velocityX = 0
    var velocityY = 0
    var friction = 1.9

    ////Platform Variables
    var platformX = []
    var platformY = []
    var platformWidth = []
    var platformHeight = []

    /////Projectile Variables
    var playerAttack = []
    // {
    //     x: 0,
    //     y: 0,
    //     speedx: 0,
    //     speedy: 0,
    // }
    var playerAttackWidth = 30
    var playerAttackHeight = 30
    var projectileVelocityX = 30
    var projectileWhenDidWeShootTheLastBulletButInMillisecondsSoWeCanFigureOutIfWeNeedToShootAgain = 0
    var projectileTimeBetweenShots = 150

    ////Room Variables
    var roomOne = true
    var roomTwo = false
    var roomThree = false
    //[x,y,width,height]
    platformDetails = {
        platformOne: [0, 0, 2000, 70],
        platformTwo: [0, 0, 100, 1000],
        platformThree: [0, 900, 2000, 100],
        platformFour: [1900, 50, 100, 300],
        platformFive: [1900, 600, 100, 300],
        platformSix: [1900, 600, 100, 300],
    }






    document.addEventListener("keydown", keyDownPress)
    document.addEventListener("keyup", keyUpPress)

    //create walls
    //don't  change these. or do, I'm a comment not a cop
    createPlatform(platformDetails.platformOne[0], platformDetails.platformOne[1], platformDetails.platformOne[2], platformDetails.platformOne[3])
    createPlatform(platformDetails.platformTwo[0], platformDetails.platformTwo[1], platformDetails.platformTwo[2], platformDetails.platformTwo[3])
    createPlatform(platformDetails.platformThree[0], platformDetails.platformThree[1], platformDetails.platformThree[2], platformDetails.platformThree[3])
    createPlatform(platformDetails.platformFour[0], platformDetails.platformFour[1], platformDetails.platformFour[2], platformDetails.platformFour[3])
    createPlatform(platformDetails.platformFive[0], platformDetails.platformFive[1], platformDetails.platformFive[2], platformDetails.platformFive[3])
    createPlatform(platformDetails.platformSix[0], platformDetails.platformSix[1], platformDetails.platformSix[2], platformDetails.platformSix[3])

    //////////////////////////////////////////////////////////////////
    /////////////////// CORE LOGIC ///////////////////////////////
    //////////////////////////////////////////////////////////////////


    requestAnimationFrame(main)


    function main(totalTimeElapsed) { //delta is total time elapsed in ms since the last time the function was called
        var delta = totalTimeElapsed - previousTotalTimeElapsed   //how much time since the last frame of the game
        ctx.clearRect(0, 0, 2000, 2000)
        drawPlatforms()
        frictionAndGravity()
        player.x = player.x + velocityX //* delta //this will increase or decrease your velocity based on how much lag the game has, so it always looks like it's moving the same speed despite how fast of a computer you have
        player.y = player.y + velocityY //* delta
        // fpsCounter(delta)

        //ctx.drawImage(character1.sprite, 100, 100, 100,100) 

        collision(player)
        for (let i = 0; i < playerAttack.length; i++) {
            collision(playerAttack[i])

        }
        keyboardControlActions()
        // changeAnimationType()
        // animate()
        ///debug()
        drawCharacter()
        attack(totalTimeElapsed)
        debugMovement()
        // changeRoomProps()
        changeRoom()
        previousTotalTimeElapsed = totalTimeElapsed
        requestAnimationFrame(main)
    }

    var runningDeltaAverage = [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16]
    function fpsCounter(delta) {
        runningDeltaAverage.splice(0, 1) //delete first delta
        runningDeltaAverage.push(delta) //adds the new delta to the end
        var averageFPS = 0

        for (let i = 0; i < runningDeltaAverage.length; i++) {
            averageFPS += runningDeltaAverage[i]; //add up all the fps       
        }
        averageFPS = averageFPS / runningDeltaAverage.length //get the average fps

        ctx.font = "24px Arial";
        ctx.fillText(Math.floor(1000 / averageFPS), player.x, player.y)
    }

    //////////////////////////////////////////////////////////////////
    /////////////////// HELPER FUNCTIONS ///////////////////////////////
    //////////////////////////////////////////////////////////////////


    function drawCharacter() {
        ctx.fillStyle = "#AAF6BD";
        ctx.fillRect(player.x, player.y, player.width, player.height);

    }

    function frictionAndGravity() {
        if (velocityX > maxSpeed) { //limits speed to maxSpeed
            velocityX = maxSpeed
        }

        if (velocityX < -maxSpeed) { //limits speed to maxSpeed
            velocityX = -maxSpeed
        }

        if (velocityY > maxSpeed) { //limits speed to maxSpeed
            velocityY = maxSpeed
        }

        if (velocityY < -maxSpeed) { //limits speed to maxSpeed
            velocityY = -maxSpeed
        }

        //friction
        if (Math.abs(velocityX) < 1) { //this makes sure that the player actually stops when the speed gets low enough
            //otherwise if you just always reduce speed it will just end up jiggling
            velocityX = 0
        }
        else if (velocityX > 0) {
            velocityX = velocityX - friction
        } else {
            velocityX = velocityX + friction
        }
        if (Math.abs(velocityY) < 1) { //this makes sure that the player actually stops when the speed gets low enough
            //otherwise if you just always reduce speed it will just end up jiggling
            velocityY = 0
        }
        else if (velocityY > 0) {
            velocityY = velocityY - friction
        } else {
            velocityY = velocityY + friction
        }

    }

    function keyDownPress(e) {
        anyKeyPress = true
        if (e.key === "d") {
            player.moveRight = true
        }
        if (e.key === "a") {
            player.moveLeft = true
        }
        if (e.key === "w") {
            player.moveUp = true
        }
        if (e.key === "s") {
            player.moveDown = true
        }
        if (e.key === "ArrowRight") {
            player.attackRight = true
        }
        if (e.key === "ArrowLeft") {
            player.attackLeft = true
        }
        if (e.key === "ArrowUp") {
            player.attackUp = true
        }
        if (e.key === "ArrowDown") {
            player.attackDown = true
        }
    }

    function keyUpPress(e) {
        if (e.key === "d") {
            player.moveRight = false
        }
        if (e.key === "a") {
            player.moveLeft = false
        }
        if (e.key === "w") {
            player.moveUp = false
        }
        if (e.key === "s") {
            player.moveDown = false
        }
        if (e.key === "ArrowRight") {
            player.attackRight = false
        }
        if (e.key === "ArrowLeft") {
            player.attackLeft = false
        }
        if (e.key === "ArrowUp") {
            player.attackUp = false
        }
        if (e.key === "ArrowDown") {
            player.attackDown = false
        }
    }

    function keyboardControlActions() {
        anyKeyPress = false //keyboardHandler will set this to true if you press any key. setting the variable to false here makes sure that key press dosen't stick around.
        //this is used for respawning, basicly if you hit any key after you die this variable will be set to true and you will respawn. 

        if (player.moveUp) {
            velocityY -= walkAccelerationForward
        }
        if (player.moveDown) {
            velocityY += walkAccelerationForward
        }
        if (player.moveLeft) {
            velocityX -= walkAccelerationForward
        }
        if (player.moveRight) {
            velocityX += walkAccelerationForward
        }

    }

    function debugMovement() {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black"
        ctx.fillText("velocity X: " + velocityX + " velocity Y: " + velocityY, 100, 100)
        ctx.fillText("up: " + player.attackUp + " down: " + player.attackDown + " right: " + player.attackRight + " left: " + player.attackLeft, 100, 200)
        ctx.fillText(player.x + ", " + player.y, 100, 300)
        ctx.fillText("room one? " + roomOne + " room two? " + roomTwo + " room three? " + roomThree, 100, 400)
        ctx.fillText(playerAttack, 100, 500)

    }

    function drawPlatforms() {
        for (var i = 0; i < platformX.length; i++) {
            ctx.fillStyle = "grey"
            ctx.fillRect(platformX[i], platformY[i], platformWidth[i], platformHeight[i])
        }
    }

    function createPlatform(x, y, width, height) {
        platformX.push(x)
        platformY.push(y)
        platformHeight.push(height)
        platformWidth.push(width)
    }

    function collision(collider) {
        collider.OnGround = false //you reset this every frame, if the player is actually on the ground the resolveCollision function will set it to true
        var result = undefined
        for (var i = 0; i < platformX.length; i++) { //check every platform
            if (collider.x + collider.width > platformX[i]) { //if the right side of the player is inside of the left side of the platform
                if (collider.x < platformX[i] + platformWidth[i]) { //and the left side of the player is inside of the right side of the platform
                    if (collider.y < platformY[i] + platformHeight[i]) { //top of player is above bottom of platform
                        if (collider.y + collider.height > platformY[i]) {//bottom of player is below top of platform
                            //now that we know we have collided we figure out the direction of collision
                            result = resloveCollision(collider, platformX[i], platformY[i], platformWidth[i], platformHeight[i])
                        }
                    }
                }
            }
        }
        return result

    }

    function resloveCollision(collider, objx, objy, objw, objh) { //collider has x y with and height
        //this is the return value
        let collisionDirection = ""
        //found here https://stackoverflow.com/questions/38648693/resolve-collision-of-two-2d-elements
        //first we find the distance between the center of the object and the player
        let dx = (collider.x + (collider.height / 2)) - (objx + (objw / 2))
        let dy = (collider.y + (collider.height / 2)) - (objy + (objh / 2))

        //get half widths of each item
        //i'm honestly not 100% certian why this step is in there, but it works.
        let halfWidth = (collider.height / 2) + (objw / 2)
        let halfHeight = (collider.height / 2) + (objh / 2)

        // if the x and y vector are less than the half width or half height,
        // they we must be inside the object, causing a collision
        //         if (Math.abs(dx) <= halfWidth) {
        // if (Math.abs(dy) <= halfHeight) {
        //what side are we colliding on?
        let originx = halfWidth - Math.abs(dx)
        let originy = halfHeight - Math.abs(dy)



        if (originx >= originy) {
            if (dy > 0) {                    //bottom collision
                collisionDirection = 'bottom'
                collider.y = collider.y + originy + 1
                collider.speedy = 0
            } else {                         //top collision
                collisionDirection = 'top'
                collider.y = collider.y - originy
                collider.speedy = 0
                collider.OnGround = true
            }
        } else {
            if (dx > 0) {                    //left collision
                collisionDirection = 'left'
                collider.x = collider.x + originx
                collider.speedx = 0
            } else {                        //right collision
                collisionDirection = 'right'
                collider.x = collider.x - originx
                collider.speedx = 0
            }
        }

        return collisionDirection

    }

    function attack(totalTimeElapsed) {
        if (totalTimeElapsed >= projectileTimeBetweenShots + projectileWhenDidWeShootTheLastBulletButInMillisecondsSoWeCanFigureOutIfWeNeedToShootAgain) {
            if (player.attackDown) {
                playerAttack.push({
                    x: player.x + (player.width / 3),
                    y: player.y + player.height,
                    speedx: 0,
                    speedy: projectileVelocityX
                })
            } else if (player.attackUp) {
                playerAttack.push({
                    x: player.x + (player.width / 3),
                    y: player.y - playerAttackHeight,
                    speedx: 0,
                    speedy: -projectileVelocityX
                })
            } else if (player.attackRight) {
                playerAttack.push({
                    x: player.x + player.width,
                    y: player.y + (player.height / 3),
                    speedx: projectileVelocityX,
                    speedy: 0
                })
            } else if (player.attackLeft) {
                playerAttack.push({
                    x: player.x - playerAttackWidth,
                    y: player.y + (player.height / 3),
                    speedx: -projectileVelocityX,
                    speedy: 0
                })
            }
            projectileWhenDidWeShootTheLastBulletButInMillisecondsSoWeCanFigureOutIfWeNeedToShootAgain = totalTimeElapsed
        }




        //code for moving the projectiles
        for (var i = 0; i < playerAttack.length; i++) {
            ctx.fillStyle = "red"
            ctx.fillRect(playerAttack[i].x, playerAttack[i].y, playerAttackWidth, playerAttackHeight)
            playerAttack[i].x = playerAttack[i].x + playerAttack[i].speedx
            playerAttack[i].y = playerAttack[i].y + playerAttack[i].speedy
            if (playerAttack[i].x > 1870 || playerAttack[i].x < 100 || playerAttack[i].y > 890 || playerAttack[i].y < 70) {
                playerAttack.splice(i, 1)
            }
        }


    }

    function changeRoom() {
        if (player.x + player.width < 1980 && roomOne) {
            changeRoomProps()
        }
        if (player.x + player.width >= 1980 && roomOne) {
            player.x = 100
            roomOne = false
            roomTwo = true
            roomThree = false
            changeRoomProps()
        }else if (player.x <= 100 && roomTwo){
            player.x = 1880
            roomOne = true
            roomTwo = false
            roomThree = false
            changeRoomProps()
        }
        if (player.x + player.width >= 1980 && roomTwo) {
            player.x = 100
            roomOne = false
            roomTwo = false
            roomThree = true
            changeRoomProps()
        }else if (player.x <= 100 && roomThree){
            player.x = 1880
            roomOne = false
            roomTwo = true
            roomThree = false
            changeRoomProps()
        }
    }
    function changeRoomProps() {
        if (roomOne) {
            platformDetails.platformOne = [0, 0, 2000, 70]
            platformDetails.platformTwo = [0, 0, 100, 1000]
            platformDetails.platformThree = [0, 900, 2000, 100]
            platformDetails.platformFour = [1900, 50, 100, 300]
            platformDetails.platformFive = [1900, 600, 100, 300]
            platformDetails.platformSix = [1900, 600, 100, 300]
        } else if (roomTwo) {
            platformDetails.platformOne = [0, 0, 2000, 70]
            platformDetails.platformTwo = [0, 0, 100, 300]
            platformDetails.platformThree = [0, 600, 100, 300]
            platformDetails.platformFour = [0, 900, 2000, 100]
            platformDetails.platformFive = [1900, 50, 100, 300]
            platformDetails.platformSix = [1900, 600, 100, 300]
        } else if (roomThree) {
            platformDetails.platformOne = [0, 0, 700, 70]
            platformDetails.platformTwo = [1300, 0, 700, 70]
            platformDetails.platformThree = [0, 0, 100, 300]
            platformDetails.platformFour = [0, 600, 100, 300]
            platformDetails.platformFive = [0, 900, 2000, 100]
            platformDetails.platformSix = [1900, 50, 100, 1000]
        }
    
    }
    //////ROOM ONE vvvv
    // createPlatform(0, 0, 2000, 70)
    // createPlatform(0, 0, 100, 1000)
    // createPlatform(0, 900, 2000, 100)
    // createPlatform(1900, 50, 100, 300)
    // createPlatform(1900, 600, 100, 300)
    //////ROOM TWO vvvv
    // createPlatform(0, 0, 2000, 70)
    // createPlatform(0, 0, 100, 300)
    // createPlatform(0, 600, 100, 300)
    // createPlatform(0, 900, 2000, 100)
    // createPlatform(1900, 50, 100, 300)
    // createPlatform(1900, 600, 100, 300)
    //////ROOM THREE vvvv
    // createPlatform(0, 0, 700, 70)
    // createPlatform(1300, 0, 700, 70)
    // createPlatform(0, 0, 100, 300)
    // createPlatform(0, 600, 100, 300)
    // createPlatform(0, 900, 2000, 100)
    // createPlatform(1900, 50, 100, 1000)


}