window.onload = function () {


    var canvas = document.getElementById("canvas")
    var ctx = canvas.getContext("2d")
    const image = document.getElementById("crimpi")
    var pageList = {}
    var interactableTextColor = "white"
    var scrimbloTextColor = "#65ff88"
    var scrimbloTextSize = 45
    var backTextSize = 50
    var interactableColor = "red"



    document.getElementById("canvas").addEventListener("click", loadNextPage);
    // document.getElementById("FOHCAJ").addEventListener("mouseenter", triangle);

    ctx.drawImage(image, 1000, 100, 400, 400)
    ctx.font = "bold 50px Courier New";
    ctx.fillText("Meet Scrimblo, your classmate, virtual assistant, and best friend!", 150, 100)
    ctx.font = "30px Courier New";
    ctx.fillText("Scrimblo is here to represent the 'Fundamentals of HTML, CSS, and Javascript' and 'Advanced Javascript' classes.", 140, 550)
    ctx.fillText("Ask any of the following questions and Scrimblo will answer!", 600, 620)
    // ctx.fillText("x: " + x + " y: " + x, 100, 300)
    // console.log(e)

    ctx.fillRect(140, 650, 2000, 800)


    loadPage()
    var currentPage = pageList.mainPage
    // var currentPage = pageList.mainPage
    function main() {
        // ctx.clearRect(0, 0, 2000, 2000)



        drawInteractables(currentPage.interactables)
        ctx.fillStyle = 'black'
        ctx.fillRect(140, 650, 2000, 800)
        drawText(currentPage.text)
        // console.log(currentPage.text[0].text)
    }

    setInterval(main, 50);


    function createPage(textList, interactableList) {
        return {
            interactables: interactableList,
            text: textList
        }
    }
    function createText(color, x, y, text, size) {
        return { x: x, y: y, color: color, text: text, size: size }

    }
    function createInteractable(color, x, y, width, height, id) {
        return { x: x, y: y, color: color, width: width, height: height, id: id }

    }

    function drawText(textList) {
        for (i = 0; i < textList.length; i++) {
            ctx.fillStyle = textList[i].color
            // ctx.font = "30px Courier New";
            // ctx.font = "'" + textList[i].size + "px Courier New' ";

            ctx.fillText(textList[i].text, textList[i].x, textList[i].y)
        }

    }
    function drawInteractables(interactableList) {
        for (i = 0; i < interactableList.length; i++) {
            ctx.fillStyle = interactableList[i].color
            ctx.fillRect(interactableList[i].x, interactableList[i].y, interactableList[i].width, interactableList[i].height)
        }

    }

    function loadPage() {
        pageList.mainPage = createPage(
            [
                createText(interactableTextColor, 200, 725, "What is Fundamentals of HTML, CSS, and Javascript?", scrimbloTextSize),
                createText(interactableTextColor, 400, 825, "What is Advanced Javascript?", scrimbloTextSize),
                createText(interactableTextColor, 430, 925, "Will I enjoy this class?", scrimbloTextSize),
                createText(interactableTextColor, 1200, 725, "Can I see examples of these projects in action?", scrimbloTextSize),
                createText(interactableTextColor, 1430, 825, "Who made this website?", scrimbloTextSize),
                createText(interactableTextColor, 1420, 925, "Who teaches this class?", scrimbloTextSize),
            ],
            [
                createInteractable(interactableColor, 200, 680, 900, 70, "FOHCAJ"),
                createInteractable(interactableColor, 1180, 680, 900, 70, "example"),
                createInteractable(interactableColor, 200, 780, 900, 70, "ASD"),
                createInteractable(interactableColor, 1180, 780, 900, 70, "me"),
                createInteractable(interactableColor, 200, 880, 900, 70, "enjoy"),
                createInteractable(interactableColor, 1180, 880, 900, 70, "teacher"),
            ]
        )
        pageList.FOHCAJ = createPage(
            [
                ////text
                createText(scrimbloTextColor, 170, 700, "'Fundamentals of HTML, CSS, and Javascript is an introductory class for anyone wanting to learn programming ", scrimbloTextSize), /// anyone wanting to learn programming in Javascript
                createText(scrimbloTextColor, 170, 750, "in Javascript. It contains the building blocks for programming as a whole, as most programming languages ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 800, "build off of each other, and once you learn one of them, it'll become easier to learn the next. In this ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 850, "course you will learn the basics of formatting interactive websites with Javascript.' ", scrimbloTextSize),
                createText(scrimbloTextColor, 1900, 950, "BACK", backTextSize),
            ],
            [
                createInteractable(interactableColor, 1800, 900, 300, 80, "back"),
            ]
        )
        pageList.ASD = createPage(
            [
                createText(scrimbloTextColor, 170, 700, "'Advanced Javascript is a course that builds off of what is learned in the Fundamentals of HTML, CSS, and ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 750, "Javascript class. This of course means that in order to take this class, you must first complete the ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 800, "Fundamentals class before you can take this one. This course teaches you more of the in-depth ways to format ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 850, "and write code in a more succinct way.'", scrimbloTextSize),
                createText(scrimbloTextColor, 1900, 950, "BACK", backTextSize),
            ],
            [
                createInteractable(interactableColor, 1800, 900, 300, 80, "back"),
            ]
        )
        pageList.enjoy = createPage(
            [
                createText(scrimbloTextColor, 170, 700, "These courses might seem boring at an inital glance, especially with how much programming seems to be  ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 750, "attributed to website design and website design alone, but there is a lot to enjoy about programming. ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 800, "Something that you might be interested in if you want to go into programming but don't want to do website design ", scrimbloTextSize), //
                createText(scrimbloTextColor, 170, 850, "is video game development. And video game development is part of what you learn in these courses. ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 900, "Admittedly, these video game projects are contained within websites, but all of the components you'd be ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 950, "interested in are here. Not only that, but these projects don't have to look serious nor ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 1000, "professional. You can just have fun.'", scrimbloTextSize),
                createText(scrimbloTextColor, 1900, 950, "BACK", backTextSize),
            ],
            [
                createInteractable(interactableColor, 1800, 900, 300, 80, "back"),
            ]
        )
        pageList.me = createPage(
            [
                createText(scrimbloTextColor, 170, 700, "'Mackenzie LeBlanc made this website. Mackenzie is currently manning the Law Studies booth so feel free to ", scrimbloTextSize),
                createText(scrimbloTextColor, 170, 750, "stop by if you have questions.'", scrimbloTextSize),
                createText(scrimbloTextColor, 1900, 950, "BACK", backTextSize),
            ],
            [
                createInteractable(interactableColor, 1800, 900, 300, 80, "back"),
            ]
        )
        pageList.teacher = createPage(
            [
                createText(scrimbloTextColor, 170, 700, "'Mr. Darouse teaches the class.'", scrimbloTextSize),
                createText(scrimbloTextColor, 1900, 950, "BACK", backTextSize),
            ],
            [
                createInteractable(interactableColor, 1800, 900, 300, 80, "back"),
            ]
        )
    }

    function loadNextPage(e) {
        // switch (currentPage) {
        //     case pageList.mainPage:
        // console.log(e.clientX + ", " + currentPage.interactables[0].x)
        // console.log(e.clientX + ", " + currentPage.interactables[0].width)
        // console.log(e.clientY + ", " + currentPage.interactables[0].y)
        // console.log(e.clientY + ", " + currentPage.interactables[0].height)
        for (i = 0; i < currentPage.interactables.length; i++) {
            let boxID = whichBox(e, currentPage.interactables[i])
            if (boxID === "example") {
                return example()
            } else if (boxID === "FOHCAJ") {
                return currentPage = pageList.FOHCAJ

            } else if (boxID === "ASD") {
                return currentPage = pageList.ASD

            } else if (boxID === "enjoy") {
                return currentPage = pageList.enjoy

            } else if (boxID === "me") {
                return currentPage = pageList.me

            } else if (boxID === "teacher") {
                return currentPage = pageList.teacher

            } else if (boxID === "back") {
                return currentPage = pageList.mainPage

            }

        }


        // break;
        // }
    }

    function example() {
        window.location.href = "https://mackenzieleblanc.github.io/racer/"
    }

    function triangle(e) {
        var boxID = whichBox(e, currentPage.interactables)
        if (boxID === "example") {
            ctx.strokeStyle = "red"
            // Set start-point
            ctx.moveTo(200, 750);

            // Set sub-points
            ctx.lineTo(200, 790);
            ctx.lineTo(240, 780);


            // Set end-point
            ctx.lineTo(200, 750);

            // Stroke it (do the drawing)
            ctx.stroke();
        } else if (boxID === "FOHCAJ") {
            alert("DOIASDHOIASH")
            ctx.strokeStyle = "red"
            // Set start-point
            ctx.moveTo(200, 725);

            // Set sub-points
            ctx.lineTo(200, 765);
            ctx.lineTo(240, 755);


            // Set end-point
            ctx.lineTo(200, 725);

            // Stroke it (do the drawing)
            ctx.stroke();

        } else if (boxID === "ASD") {
            return currentPage = pageList.ASD

        } else if (boxID === "enjoy") {
            return currentPage = pageList.enjoy

        } else if (boxID === "me") {
            return currentPage = pageList.me

        } else if (boxID === "teacher") {
            return currentPage = pageList.teacher

        } else if (boxID === "back") {
            return currentPage = pageList.mainPage

        }




    }

    function whichBox(e, interactable) {

        if (e.clientX > interactable.x) {
            if (e.clientX < interactable.x + interactable.width) {
                if (e.clientY > interactable.y) {
                    if (e.clientY < interactable.y + interactable.height) {
                        return interactable.id

                        // console.log(e.clientX + ", " + currentPage.interactables[0].x)
                        // console.log(e.clientX + ", " + currentPage.interactables[0].width)
                        // console.log(e.clientY + ", " + currentPage.interactables[0].y)
                        // console.log(e.clientY + ", " + currentPage.interactables[0].height)
                    }
                }
            }
        }



    }
    // if (e.clientX > currentPage.interactables[0].x && e.clientY < currentPage.interactables[0].y && e.clientX < currentPage.interactables[0].width && e.clientY > currentPage.interactables[0].height) {


    // }
}