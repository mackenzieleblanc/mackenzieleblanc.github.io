window.onload = function () {
    document.getElementById("button").addEventListener("click", main);
    
    function main() {
        pizza = GenPara();
        document.getElementById("question").innerText= "";
        document.getElementById("mon").innerText= pizza;

    }

    function GenNum(num) {
        yip = Math.floor(Math.random() * num);
        if (yip === 0) {
            GenNum(num);
        }

        return yip;
    }

    function GetLetter() {
        l = GenNum(25);
        item = "This number does not exist";
        switch (l) {
            case 25:
                item = "z";
                break;
            case 24:
                item = "y";
                break;
            case 23:
                item = "x";
                break;
            case 22:
                item = "w";
                break;
            case 21:
                item = "v";
                break;
            case 20:
                item = "u";
                break;
            case 19:
                item = "t";
                break;
            case 18:
                item = "s";
                break;
            case 17:
                item = "r";
                break;
            case 16:
                item = "q";
                break;
            case 15:
                item = "p";
                break;
            case 14:
                item = "o";
                break;
            case 13:
                item = "n";
                break;
            case 12:
                item = "m";
                break;
            case 11:
                item = "l";
                break;
            case 10:
                item = "k";
                break;
            case 9:
                item = "j";
                break;
            case 8:
                item = "i";
                break;
            case 7:
                item = "h";
                break;
            case 6:
                item = "g";
                break;
            case 5:
                item = "f";
                break;
            case 4:
                item = "e";
                break;
            case 3:
                item = "d";
                break;
            case 2:
                item = "c";
                break;
            case 1:
                item = "b";
                break;
            case 0:
                item = "a";
                break;

        }
        return item;

    }

    function GenWord() {
        length = GenNum(15);
        word = "";

        for (i = 0; i < length; i++) {
            word += GetLetter();
        }

        return word;
    }

    function GenSent() {
        len = GenNum(10);
        sent = "";
        tpain = "";

        for (j = 0; j < len; j++) {
            tpain = GenWord();

            sent += tpain;
            //console.log("word: " + tpain);
            //console.log("sentence: " + sent);

            if (j < (len - 1)) {
                //console.log(j < (len - 2));
                sent += " ";

            } else {
                sent += ".";
            }

        }
        //console.log("End line");
        return sent;
    }

    function GenPara() {
        linguine = GenNum(7);
        pgraph = "";

        for (k = 0; k < linguine; k++) {

            pgraph += GenSent();

            if (k < (linguine - 1)) {
                pgraph += " ";

            }
        }
        return pgraph;
    }


}