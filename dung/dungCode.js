
window.onload = function () {


    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    const maxSpeed = 15
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
        health: 400,
        type: "player"
    }
    var previousTotalTimeElapsed = 0
    var velocityX = 0
    var velocityY = 0
    var friction = 1.9


    /////Projectile Variables
    var playerAttack = [] //go to attack() function to see what is in the projectile object
    var playerAttackWidth = 30
    var playerAttackHeight = 30
    var projectileVelocity = 30
    var projectileWhenDidWeShootTheLastBulletButInMillisecondsSoWeCanFigureOutIfWeNeedToShootAgain = 0
    var projectileTimeBetweenShots = 200
    ///Enemy Projectile Variables
    var enemyAttackProjectiles = []
    var enemyProjectileTimeBetweenShots = {
        calm: 1000,
        normal: 250,
        enraged: 100,
    }
    var enemyProjectileVelocity = {
        calm: 1800,
        normal: 1000,
        enraged: 400,
    }
    var enemyProjectileWhenDidWeShootTheLastBulletButInMillisecondsSoWeCanFigureOutIfWeNeedToShootAgain = 0


    ////Room Variables
    //[x,y,width,height]
    platformDetails = {
        platformOne: [0, 0, 2000, 70],
        platformTwo: [0, 0, 100, 1000],
        platformThree: [0, 900, 2000, 100],
        platformFour: [1900, 50, 100, 300],
        platformFive: [1900, 600, 100, 300],
        platformSix: [1900, 600, 100, 300],
    }

    const WALL_SIDES = { left: "left", right: "right", top: "top", bottom: "bottom" }
    const ENEMY_TYPE = {
        turret: "turret",
        soldier: "soldier",
        tank: "tank",
        boss: "boss"
    }
    const ENEMY_TYPE2 = {
        turret: {
            "size": 10,
            "timeBetweenShot": 100,
            "health": 10,
        },
        soldier: "soldier",
        tank: "tank",
        boss: "boss"
    }

    ////player projectile damage: 25
    ////player health: 400
    /*types of enemies:
    *turret: shoots in one direction, small, least amount of health (health: 15) (damage: 20)

    *soldier: shoots at the position of the player, medium size, average amount of health (health: 50) (damage: 40)

    *double gunner: shoots two series of five back-to-back shots in one direction (y coors
     of attack resembles an equal sign "="), large size, large amount of health (health: 200) (damage: 45)

    *shapeshifter (miniboss): spawns a number of enemies and turns into one of the enemies spawned, once 
    player hits the enemy that is actually the shapeshifter all of the other enemies disappear 
    and it moves to the upper-center of the screen and shoots projectiles in a way similar to soldier projectiles,
     repeat until player or mini-boss is dead (health: 375) (damage: 50)

    *quadtuple gunner (miniboss): moves to center of screen and shoots in a clock-wise pattern for 50 shots
     before stopping for a few seconds, repeat until player or mini-boss is dead (health: 375) (damage: 50)

    *boss: four phases of attack: (health: 750) (damage: 60)
    *phase one: runs up to player, faces them and attacks directly, afterwards jumps and player 
    has to dodge where it lands, loop until player is dead or boss has 375 health, then go 
    to next phase
    *phase two: spawns mini-boss "shapeshifter", player has to fight mini-boss while stopping 
    the boss's attempts to heal itself
    *phase three: spawns mini-boss "quadtruple gunner", player has to fight mini-boss while 
    stopping the boss's attempts to heal itself
    *phase four: boss jumps and hits ground really hard and launches projectiles in octagon
     pattern, afterwards spins around trying to hit the player, repeat until player is dead 
     or boss is defeated
    */


    const ENEMY_STATE = { calm: "calm", normal: "normal", enraged: "enraged" }
    const ENEMY_DIRECTION = { left: "left", right: "right", down: "down", up: "up" }

    var roomList = {}
    var currentRoomsInMap = []
    /*there are multiple rooms, each room consists of:
        * the platforms in the room
        * doors (doors have a link to another room and a position)
        * enemies list

    */

    document.addEventListener("keydown", keyDownPress)
    document.addEventListener("keyup", keyUpPress)

    //create walls
    //don't  change these. or do, I'm a comment not a cop
    loadRooms() //this populates the roomList
    var currentRoom = roomList.roomOne //this sets the current room






    // createPlatform(platformDetails.platformOne[0], platformDetails.platformOne[1], platformDetails.platformOne[2], platformDetails.platformOne[3])
    // createPlatform(platformDetails.platformTwo[0], platformDetails.platformTwo[1], platformDetails.platformTwo[2], platformDetails.platformTwo[3])
    // createPlatform(platformDetails.platformThree[0], platformDetails.platformThree[1], platformDetails.platformThree[2], platformDetails.platformThree[3])
    // createPlatform(platformDetails.platformFour[0], platformDetails.platformFour[1], platformDetails.platformFour[2], platformDetails.platformFour[3])
    // createPlatform(platformDetails.platformFive[0], platformDetails.platformFive[1], platformDetails.platformFive[2], platformDetails.platformFive[3])
    // createPlatform(platformDetails.platformSix[0], platformDetails.platformSix[1], platformDetails.platformSix[2], platformDetails.platformSix[3])

    //////////////////////////////////////////////////////////////////
    /////////////////// CORE LOGIC ///////////////////////////////
    //////////////////////////////////////////////////////////////////


    requestAnimationFrame(main)


    function main(totalTimeElapsed) { //delta is total time elapsed in ms since the last time the function was called
        var delta = totalTimeElapsed - previousTotalTimeElapsed   //how much time since the last frame of the game
        ctx.clearRect(0, 0, 2000, 2000)
        if (player.health <= 0) {
            deathOfPlayer()
        }
        drawPlatforms(currentRoom.platforms)
        drawEnemies(currentRoom.enemies)
        frictionAndGravity()
        player.x = player.x + velocityX //* delta //this will increase or decrease your velocity based on how much lag the game has, so it always looks like it's moving the same speed despite how fast of a computer you have
        player.y = player.y + velocityY //* delta
        fpsCounter(delta)

        //ctx.drawImage(character1.sprite, 100, 100, 100,100) 

        collision(player, currentRoom.platforms)
        for (let i = 0; i < playerAttack.length; i++) {
            collision(playerAttack[i], currentRoom.platforms)
            collision(playerAttack[i], currentRoom.enemies)
        }
        for (let i = 0; i < enemyAttackProjectiles.length; i++) {
            collision(enemyAttackProjectiles[i], currentRoom.platforms)
            collision(player, enemyAttackProjectiles)
        }
        keyboardControlActions()
        // changeAnimationType()
        // animate()
        ///debug()
        drawCharacter()
        attack(totalTimeElapsed)
        if (currentRoom.enemies.length > 0) {
            enemyAttack(totalTimeElapsed)
        }
        debugMovement(totalTimeElapsed)
        // changeRoomProps()
        changeRoom(currentRoom.doors)
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

    function debugMovement(totalTimeElapsed) {
        ctx.font = "30px Arial";
        ctx.fillStyle = "black"
        ctx.fillText("velocity X: " + velocityX + " velocity Y: " + velocityY, 100, 100)
        ctx.fillText("up: " + player.attackUp + " down: " + player.attackDown + " right: " + player.attackRight + " left: " + player.attackLeft, 100, 200)
        ctx.fillText(player.x + ", " + player.y, 100, 300)
        ctx.fillText(playerAttack, 100, 400)
        ctx.fillText(player.health, 100, 500)
        ctx.fillText(totalTimeElapsed, 100, 600)
        ctx.fillText(currentRoom.enemies.length, 100, 700)

    }

    function drawPlatforms(platforms) {
        for (var i = 0; i < platforms.length; i++) {
            ctx.fillStyle = "grey"
            ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height)
        }
    }

    function drawEnemies(enemies) {
        for (var i = 0; i < enemies.length; i++) {
            if (currentRoom.enemies[i].enemyType === "turret") {
                ctx.fillStyle = "#FE8DB8"
            } else if (currentRoom.enemies[i].enemyType === "soldier") {
                ctx.fillStyle = "#FF0000"
            } else if (currentRoom.enemies[i].enemyType === "tank") {
                ctx.fillStyle = "#D61F6C"
            } else if (currentRoom.enemies[i].enemyType === "boss") {
                ctx.fillStyle = "#640096"
            }
            ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height)
        }
    }

    // function createPlatform(x, y, width, height) { depricated
    //     platformX.push(x)
    //     platformY.push(y)
    //     platformHeight.push(height)
    //     platformWidth.push(width)
    // }

    function collision(collider, obstacleList) {
        collider.OnGround = false //you reset this every frame, if the player is actually on the ground the resolveCollision function will set it to true
        var result = undefined
        for (var i = 0; i < obstacleList.length; i++) { //check every platform
            if (collider.x + collider.width > obstacleList[i].x) { //if the right side of the player is inside of the left side of the platform
                if (collider.x < obstacleList[i].x + obstacleList[i].width) { //and the left side of the player is inside of the right side of the platform
                    if (collider.y < obstacleList[i].y + obstacleList[i].height) { //top of player is above bottom of platform
                        if (collider.y + collider.height > obstacleList[i].y) {//bottom of player is below top of platform
                            //now that we know we have collided we figure out the direction of collision
                            if (collider.type === "player" && obstacleList[i].type === "platform") {
                                result = resloveCollision(collider, obstacleList[i].x, obstacleList[i].y, obstacleList[i].width, obstacleList[i].height)
                            } else if (collider.type === "projectile" && obstacleList[i].type === "platform") {
                                // collider.splice(1, 1)
                                collider.x = -2000 //teleport it out of bounds because that's easier than figuring out the id to splice it this is terrible but if it works yolo
                            } else if (collider.type === "player" && obstacleList[i].type === "projectile") {
                                player.health -= 40
                                obstacleList[i].x = -2000
                            } else if (collider.type === "projectile" && obstacleList[i].type === "enemy") {
                                collider.x = -2000
                            }
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
                    speedy: projectileVelocity,
                    width: playerAttackWidth,
                    height: playerAttackHeight,
                    type: "projectile",
                })
            } else if (player.attackUp) {
                playerAttack.push({
                    x: player.x + (player.width / 3),
                    y: player.y - playerAttackHeight,
                    speedx: 0,
                    speedy: -projectileVelocity,
                    width: playerAttackWidth,
                    height: playerAttackHeight,
                    type: "projectile",
                })
            } else if (player.attackRight) {
                playerAttack.push({
                    x: player.x + player.width,
                    y: player.y + (player.height / 3),
                    speedx: projectileVelocity,
                    speedy: 0,
                    width: playerAttackWidth,
                    height: playerAttackHeight,
                    type: "projectile",
                })
            } else if (player.attackLeft) {
                playerAttack.push({
                    x: player.x - playerAttackWidth,
                    y: player.y + (player.height / 3),
                    speedx: -projectileVelocity,
                    speedy: 0,
                    width: playerAttackWidth,
                    height: playerAttackHeight,
                    type: "projectile",
                })
            }
            projectileWhenDidWeShootTheLastBulletButInMillisecondsSoWeCanFigureOutIfWeNeedToShootAgain = totalTimeElapsed
        }




        //code for moving the projectiles
        for (var i = 0; i < playerAttack.length; i++) {
            ctx.fillStyle = "#1C58CF"
            ctx.fillRect(playerAttack[i].x, playerAttack[i].y, playerAttackWidth, playerAttackHeight)
            playerAttack[i].x = playerAttack[i].x + playerAttack[i].speedx
            playerAttack[i].y = playerAttack[i].y + playerAttack[i].speedy


            if (playerAttack[i].x > 1870 || playerAttack[i].x < 100 || playerAttack[i].y > 890 || playerAttack[i].y < 70) {
                playerAttack.splice(i, 1)
            }
        }


    }

    function enemyAttack(totalTimeElapsed) {
        for (let i = 0; i < currentRoom.enemies.length; i++) {
            if (totalTimeElapsed >= currentRoom.enemies[i].projectileTimeBetweenShots + currentRoom.enemies[i].shootTime) {
                if (currentRoom.enemies[i].enemyType === "soldier") {
                    enemyAttackSoldierProperty(currentRoom.enemies[i])
                } else if (currentRoom.enemies[i].enemyType === "turret") {
                    enemyAttackTurretProperty(currentRoom.enemies[i])
                }
                currentRoom.enemies[i].shootTime = totalTimeElapsed
            }
        }


        ////itirate through enemies
        ///im going to craterskull myself i swear to god
        ///this function should calculate the player's current position and the slope between the player's current position
        ///and the enemy's position and fire a projectile with that slope
        for (var i = 0; i < enemyAttackProjectiles.length; i++) {
            ctx.fillStyle = "red"
            ctx.fillRect(enemyAttackProjectiles[i].x, enemyAttackProjectiles[i].y, enemyAttackProjectiles[i].width, enemyAttackProjectiles[i].height)
            enemyAttackProjectiles[i].x = enemyAttackProjectiles[i].x + enemyAttackProjectiles[i].speedx
            enemyAttackProjectiles[i].y = enemyAttackProjectiles[i].y + enemyAttackProjectiles[i].speedy

            if (enemyAttackProjectiles[i].x > 1870 || enemyAttackProjectiles[i].x < 100 || enemyAttackProjectiles[i].y > 890 || enemyAttackProjectiles[i].y < 70) {
                enemyAttackProjectiles.splice(i, 1)
            }

        }

    }

    function enemyAttackSoldierProperty(currentEnemy) {


        let playerCenterX = player.x + (player.width / 2)
        let playerCenterY = player.y + (player.height / 2)
        let enemyCenterX = currentEnemy.x + (currentEnemy.width / 2)
        let enemyCenterY = currentEnemy.y + (currentEnemy.height / 2)
        let positionDifferenceBetweenPlayerAndEnemyX = playerCenterX - enemyCenterX
        let positionDifferenceBetweenPlayerAndEnemyY = playerCenterY - enemyCenterY
        let shootAngle = Math.atan2(positionDifferenceBetweenPlayerAndEnemyY, positionDifferenceBetweenPlayerAndEnemyX)
        let currentProjectileVelocity


        ///let positionDifferenceBetweenPlayerAndEnemyX = currentRoom.enemies[i].x - player.x
        ///let positionDifferenceBetweenPlayerAndEnemyY = currentRoom.enemies[i].y - player.y


        enemyAttackProjectiles.push({
            x: currentEnemy.x + (currentEnemy.width / 3),
            y: currentEnemy.y + (currentEnemy.height / 3),
            speedx: projectileVelocity * Math.cos(shootAngle),
            speedy: projectileVelocity * Math.sin(shootAngle),
            width: playerAttackWidth,
            height: playerAttackHeight,
            type: "projectile",
        })



    }

    function enemyAttackTurretProperty(currentEnemy) {





        ///let positionDifferenceBetweenPlayerAndEnemyX = currentRoom.enemies[i].x - player.x
        ///let positionDifferenceBetweenPlayerAndEnemyY = currentRoom.enemies[i].y - player.y

        if (currentEnemy.enemyDirection === "down") {
            enemyAttackProjectiles.push({
                x: currentEnemy.x + (currentEnemy.width / 3),
                y: currentEnemy.y + (currentEnemy.height / 3),
                speedx: 0,
                speedy: projectileVelocity,
                width: playerAttackWidth,
                height: playerAttackHeight,
                type: "projectile",
            })
        } else if (currentEnemy.enemyDirection === "up") {
            enemyAttackProjectiles.push({
                x: currentEnemy.x + (currentEnemy.width / 3),
                y: currentEnemy.y + (currentEnemy.height / 3),
                speedx: 0,
                speedy: -projectileVelocity,
                width: playerAttackWidth,
                height: playerAttackHeight,
                type: "projectile",
            })
        } else if (currentEnemy.enemyDirection === "right") {
            enemyAttackProjectiles.push({
                x: currentEnemy.x + (currentEnemy.width / 3),
                y: currentEnemy.y + (currentEnemy.height / 3),
                speedx: projectileVelocity,
                speedy: 0,
                width: playerAttackWidth,
                height: playerAttackHeight,
                type: "projectile",
            })
        } else if (currentEnemy.enemyDirection === "left") {
            enemyAttackProjectiles.push({
                x: currentEnemy.x + (currentEnemy.width / 3),
                y: currentEnemy.y + (currentEnemy.height / 3),
                speedx: -projectileVelocity,
                speedy: 0,
                width: playerAttackWidth,
                height: playerAttackHeight,
                type: "projectile",
            })
        }
        // enemyAttackProjectiles.push({
        //     x: currentRoom.enemies[i].x + (currentRoom.enemies[i].width / 3),
        //     y: currentRoom.enemies[i].y + (currentRoom.enemies[i].height / 3),
        //     speedx: projectileVelocity * Math.cos(shootAngle),
        //     speedy: projectileVelocity * Math.sin(shootAngle),
        //     width: playerAttackWidth,
        //     height: playerAttackHeight,
        //     type: "projectile",
        // })



    }


    function changeRoom(doorList) {
        for (let i = 0; i < doorList.length; i++) {

            if (player.x + player.width >= 1980 && doorList[i].wall === WALL_SIDES.right) { //right door
                playerAttack.splice(0, playerAttack.length)
                enemyAttackProjectiles = []

                player.x = 100
                currentRoom = roomList[doorList[i].room]  //change the current room to the room the door is attached to. doorList[i].room is just a string containing the name of the room
            } else if (player.x <= 20 && doorList[i].wall === WALL_SIDES.left) {
                player.x = 1800
                playerAttack.splice(0, playerAttack.length)
                enemyAttackProjectiles = []
                currentRoom = roomList[doorList[i].room]  //change the current room to the room the door is attached to. doorList[i].room is just a string containing the name of the room
            }
            if (player.y + player.height >= 980 && doorList[i].wall === WALL_SIDES.bottom) {
                player.y = 100
                playerAttack.splice(0, playerAttack.length)
                enemyAttackProjectiles = []
                currentRoom = roomList[doorList[i].room]  //change the current room to the room the door is attached to. doorList[i].room is just a string containing the name of the room
            } else if (player.y <= 20 && doorList[i].wall === WALL_SIDES.top) {
                player.y = 880
                playerAttack.splice(0, playerAttack.length)
                enemyAttackProjectiles = []
                currentRoom = roomList[doorList[i].room]  //change the current room to the room the door is attached to. doorList[i].room is just a string containing the name of the room
            }
        }
    }


    function createDoor(whichWall, connectingRoomName) { //roomIndex should be the index number of the room the door connects to
        //use the wall sides constant for this
        if (whichWall in WALL_SIDES) { //if whichWall is valid
            return { wall: whichWall, room: connectingRoomName }
        }
    }

    function createPlatformObject(x, y, width, height) {
        return { x: x, y: y, width: width, height: height, type: "platform" }
    }

    function createEnemyObject(x, y, width, height, enemyType, enemyState, enemyDirection, shootTime, projectileTimeBetweenShots) {
        if (enemyType in ENEMY_TYPE && enemyState in ENEMY_STATE && enemyDirection in ENEMY_DIRECTION) {
            return { x: x, y: y, width: width, height: height, enemyType: enemyType, enemyState: enemyState, enemyDirection: enemyDirection, shootTime: shootTime, projectileTimeBetweenShots: projectileTimeBetweenShots, type: "enemy" }
        }
        //return { x: x, y: y, width: ENEMY_TYPE[enemyType].size, height: height, enemyType: enemyType, enemyState: enemyState, enemyDirection: enemyDirection, shootTime: shootTime, projectileTimeBetweenShots: projectileTimeBetweenShots }

    }

    function createRoomObject(platformList, doorsList, enemiesList) {
        return {
            platforms: platformList,
            doors: doorsList,
            enemies: enemiesList,
            index: Object.keys(roomList).length //count how many rooms are in the list
        }
    }

    function loadRooms() {
        //all this is is creating the list of rooms for you to choose from in your current map

        roomList.roomOne = createRoomObject( //terrible name but we can come back later and change the names with ctrl + h
            [
                createPlatformObject(0, 0, 2000, 70), //top wall solid
                createPlatformObject(0, 0, 100, 1000), //left wall solid
                createPlatformObject(0, 900, 2000, 100), //bottom wall solid
                createPlatformObject(1900, 50, 100, 300), // right wall upper door
                createPlatformObject(1900, 600, 100, 300), // right wall lower door
            ],
            [
                createDoor(WALL_SIDES.right, "roomTwo")
            ],
            [] //we don't have enimies yet so this is just blank
        )
        roomList.roomTwo = createRoomObject(
            [
                createPlatformObject(0, 0, 2000, 70), //top wall solid (normal room)
                createPlatformObject(0, 0, 100, 300), // left wall upper door (normal room)
                createPlatformObject(0, 600, 100, 300), // left wall lower door (normal room)
                createPlatformObject(0, 900, 2000, 100), //bottom wall solid (normal room)
                createPlatformObject(1900, 50, 100, 300), //right wall upper door (normal room)
                createPlatformObject(1900, 600, 100, 300), //right wall lower door (normal room)
            ],
            [
                createDoor(WALL_SIDES.left, "roomOne"),
                createDoor(WALL_SIDES.right, "roomThree"),
            ],
            [
                createEnemyObject(900, 300, 100, 100, "soldier", "normal", "down", 0, enemyProjectileVelocity.normal),
                createEnemyObject(300, 150, 50, 50, "turret", "calm", "down", 0, enemyProjectileVelocity.calm),
                createEnemyObject(1600, 150, 50, 50, "turret", "enraged", "down", 0, enemyProjectileVelocity.enraged),
            ] //no baddies
        )
        roomList.roomThree = createRoomObject(
            [
                createPlatformObject(0, 0, 700, 70), //top wall left-most door (normal room)
                createPlatformObject(1300, 0, 700, 70), //top wall right-most door (normal room)
                createPlatformObject(0, 0, 100, 300), //left wall upper door (normal room)
                createPlatformObject(0, 600, 100, 300), //left wall lower door (normal room)
                createPlatformObject(0, 900, 2000, 100), // bottom wall solid (normal room)
                createPlatformObject(1900, 50, 100, 1000), // right wall solid (normal room)
            ],
            [
                createDoor(WALL_SIDES.top, "roomFour"),
                createDoor(WALL_SIDES.left, "roomTwo"),
            ],
            []
        )
        roomList.roomFour = createRoomObject(
            [
                createPlatformObject(1300, 0, 100, 1200), // right wall solid (vertical hallway)
                createPlatformObject(700, 0, 100, 1200), // left wall solid (vertical hallway)
            ],
            [
                createDoor(WALL_SIDES.bottom, "roomThree"),
                createDoor(WALL_SIDES.top, "roomFive"),
            ],
            []

        )
        roomList.roomFive = createRoomObject(
            [
                createPlatformObject(700, 0, 100, 1200), // left wall solid (vertical hallway)
                createPlatformObject(1300, 0, 100, 400), // right wall upper door (vertical hallway)
                createPlatformObject(1300, 700, 100, 700), // right wall lower door (vertical hallway)
                createPlatformObject(1300, 700, 2000, 70), //bottom wall fork in hallway (vertical hallway)
                createPlatformObject(1300, 400, 2000, 70), //top wall fork in hallway (vertical hallway)
            ],
            [
                createDoor(WALL_SIDES.bottom, "roomFour"),
                createDoor(WALL_SIDES.right, "roomSix"),
                createDoor(WALL_SIDES.top, "roomEight"),
            ],
            []
        )
        roomList.roomSix = createRoomObject(
            [
                createPlatformObject(0, 700, 700, 70), //bottom wall hallway first segment (horizontal challenge hallway)
                createPlatformObject(1300, 700, 700, 70), //bottom wall hallway second segment (horizontal challenge hallway)
                createPlatformObject(0, 400, 100, 70), //top wall hallway first segment (horizontal challenge hallway)
                createPlatformObject(500, 400, 1900, 70), //top wall hallway second segment (horizontal challenge hallway)
                createPlatformObject(100, 180, 70, 290), // left wall upper nook (horizontal challenge hallway)
                createPlatformObject(500, 180, 70, 290), // right wall upper nook (horizontal challenge hallway)
                createPlatformObject(700, 700, 70, 200), // left wall lower nook (horizontal challenge hallway)
                createPlatformObject(1300, 700, 70, 250), // right wall lower nook (horizontal challenge hallway)
                createPlatformObject(100, 180, 450, 70), //top wall upper nook (horizontal challenge hallway)
                createPlatformObject(700, 880, 600, 70), //bottom wall lower nook (horizontal challenge hallway)
            ],
            [
                createDoor(WALL_SIDES.left, "roomFive"),
                createDoor(WALL_SIDES.right, "roomSeven"),
            ],
            [
                createEnemyObject(1700, 500, 150, 150, "tank", "enraged", "left", 0, enemyProjectileVelocity.enraged)
            ]
        )
        roomList.roomSeven = createRoomObject(
            [
                createPlatformObject(0, 0, 2000, 70), //top wall solid (normal room)
                createPlatformObject(0, 0, 100, 470), // left wall upper door (normal room connected to horizontal hallway)
                createPlatformObject(0, 700, 100, 200), // left wall lower door (normal room connected to horizontal hallway)
                createPlatformObject(0, 900, 2000, 100), //bottom wall solid (normal room)
                createPlatformObject(1900, 50, 100, 1000), // right wall solid (normal room)
            ],
            [
                createDoor(WALL_SIDES.left, "roomSix")
            ],
            []
        )
        roomList.roomEight = createRoomObject(
            [
                createPlatformObject(0, 0, 700, 70), //top wall left-most door (normal room)
                createPlatformObject(1300, 0, 700, 70), //top wall right-most door (normal room)
                createPlatformObject(0, 0, 100, 300), // left wall upper door (normal room)
                createPlatformObject(0, 600, 100, 300), // left wall lower door (normal room)
                createPlatformObject(1900, 50, 100, 300), //right wall upper door (normal room)
                createPlatformObject(1900, 600, 100, 300), //right wall lower door (normal room)
                createPlatformObject(0, 900, 700, 70), //bottom wall left-most door (normal room)
                createPlatformObject(1300, 900, 700, 70), //bottom wall right-most door (normal room)
            ],
            [
                createDoor(WALL_SIDES.bottom, "roomFive"),
                createDoor(WALL_SIDES.left, "roomNine"),
                createDoor(WALL_SIDES.right, "bossRoom"),
                createDoor(WALL_SIDES.top, "roomTen"),
            ],
            []
        )
        roomList.roomNine = createRoomObject(
            [
                createPlatformObject(0, 0, 2000, 70), //top wall solid
                createPlatformObject(0, 0, 100, 1000), //left wall solid
                createPlatformObject(0, 900, 2000, 100), //bottom wall solid
                createPlatformObject(1900, 50, 100, 300), // right wall upper door
                createPlatformObject(1900, 600, 100, 300), // right wall lower door
            ],
            [
                createDoor(WALL_SIDES.right, "roomEight"),
            ],
            []
        )
        roomList.roomTen = createRoomObject(
            [
                createPlatformObject(0, 0, 2000, 100), //top wall solid
                createPlatformObject(0, 0, 100, 1000), //left wall solid
                createPlatformObject(0, 900, 700, 100), //bottom wall left-most door (normal room)
                createPlatformObject(1300, 900, 700, 100), //bottom wall right-most door (normal room)
                createPlatformObject(1900, 50, 100, 300), // right wall upper door
                createPlatformObject(1900, 600, 100, 300), // right wall lower door
            ],
            [
                createDoor(WALL_SIDES.bottom, "roomEight"),
                createDoor(WALL_SIDES.right, "roomEleven")
            ],
            []
        )
        roomList.roomEleven = createRoomObject(
            [
                createPlatformObject(0, 350, 500, 70), //bottom wall hallway first segment (horizontal challenge hallway)
                createPlatformObject(0, 600, 500, 70), //top wall hallway first segment (horizontal challenge hallway)
                createPlatformObject(500, 200, 100, 220), //upper left wall (small room)
                createPlatformObject(500, 600, 100, 300), //lower left wall (small room)
                createPlatformObject(500, 200, 1000, 100), //top wall solid (small room)
                createPlatformObject(500, 900, 1000, 100), //bottom wall solid (small room)
                createPlatformObject(1500, 200, 100, 800), //right wall solid (small room)

            ],
            [
                createDoor(WALL_SIDES.left, "roomTen")
            ],
            []
        )
        roomList.bossRoom = createRoomObject(
            [
                createPlatformObject(0, 0, 2000, 70), //top wall solid
                createPlatformObject(0, 0, 100, 300), // left wall upper door (normal room)
                createPlatformObject(0, 600, 100, 300), // left wall lower door (normal room)
                createPlatformObject(0, 900, 2000, 100), //bottom wall solid
                createPlatformObject(1900, 0, 100, 1000), // right wall solid

            ],
            [
                createDoor(WALL_SIDES.left, "roomEight")
            ],
            [
                createEnemyObject(850, 100, 300, 280, "boss", "enraged", "down", 0, enemyProjectileVelocity.enraged)
            ]
        )
    }

    function deathOfPlayer() {
        projectileVelocity = 0
        ctx.fillStyle = 'grey'
        ctx.fillRect(canvas.width / 4, canvas.height / 6, canvas.width / 2, canvas.height / 2)
        ctx.fillStyle = 'black'
        ctx.font = '800% serif'
        ctx.fillText("You are dead", canvas.width / 3, canvas.height / 6 + canvas.height / 5, canvas.width / 16 * 14)
        ctx.font = '500% serif'
        ctx.fillText("hit the any key to alive", canvas.width / 3, canvas.height / 6 + canvas.height / 3, canvas.width / 16 * 14)
        if (anyKeyPress) {
            anyKeyPress = false
            resetVariables()
        }
    }

    function resetVariables() {
        currentRoom = roomList.roomOne
        player.x = 200
        player.y = 200
        player.moveRight = false
        player.moveLeft = false
        player.moveUp = false
        player.moveDown = false
        player.attackRight = false
        player.attackLeft = false
        player.attackUp = false
        player.attackDown = false
        player.onGround = false
        player.health = 400
        projectileVelocity = 30
        for (var i = 0; i < enemyAttackProjectiles.length; i++) {
            enemyAttackProjectiles.splice(i, enemyAttackProjectiles.length)
        }
        for (var i = 0; i < playerAttack.length; i++) {
            playerAttack.splice(i, playerAttack.length)
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