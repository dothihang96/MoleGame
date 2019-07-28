$(function () {
    var score = 0,
        life = 100,
        timer = null,
        levels = [
            { level: 1, score: 0, moles: 1, interval: 1500 },
            { level: 2, score: 100, moles: 2, interval: 1500 },
            { level: 3, score: 200, moles: 2, interval: 1250 },
            { level: 4, score: 300, moles: 2, interval: 1000 },
            { level: 5, score: 500, moles: 3, interval: 1000 },
            { level: 6, score: 1000, moles: 3, interval: 750 },
        ];

    var $playingground = $("#play-ground");

    $playingground.on("click", ".mole", function () {
        var $this = $(this);

        if ($this.is(".active")) {
            score += 10;
            updateScore();
            $this
                .removeClass("active")
                .addClass("hit");
        }
    });

    $("#playing-size").change(function () {
        var size = $("#playing-size").val();
        createPlayground(size);
    });

    $("#start").click(function () {
        startGame();
    });

    $("#stop").click(function () {
        stopGame();
    });

    function startGame() {
        score = 0;
        life = 100;
        updateLife();
        nextMole();
    }

    function stopGame() {
        clearTimeout(timer);
        $(".mole.active").removeClass("active");
        $(".mole.hit").removeClass("hit");
    }

    function createPlayground(e) {
        $playingground.empty();
        var $table = $("<table></table>");

        for (var i = 0; i < e; i++) {
            var $tr = $("<tr></<tr>");
            for (var j = 0; j < e; j++) {
                var $td = $("<td></<td>")
                    .appendTo($tr);

                var $div = $("<div></div>")
                    .addClass("mole")
                    .appendTo($td);
            }
            $tr.appendTo($table);
        }
        $table.appendTo($playingground)
            .css({
                marginTop: -1 * ($table.outerHeight() / 2),
                marginLeft: -1 * ($table.outerWidth() / 2)
            });
    }

    function getLevelProfile() {
        var level = levels[0];

        for (var i = 0; i < levels.length; i++) {
            if (score >= levels[i].score) {
                level = levels[i];
            } else {
                break;
            }
        }
        return level;

    }

    function updateScore() {
        $("#current-score").text(score);
    }

    function updateLife() {
        $("#play-progress")
            .attr("aria-valuenow", life)
            .css("width", life + "%")
            .text(life);
    }

    function nextMole() {
        var $moles = $playingground.find(".mole");
        level = getLevelProfile();

        var active = $playingground.filter(".active").length;
        var hit = $playingground.filter(".hit").length;
        life -= Math.max(0, active - hit);
        updateLife();

        if (life <= 0) {
            stopGame();
            alert("Game Over");
            return;
        }

        $moles.removeClass("active").removeClass("hit");
        $("#current-level").text(level.level);

        for (var i = 0; i < level.moles; i++) {
            var next = Math.floor(Math.random() * $moles.length);
            $moles.eq(next).addClass("active");

        }

        timer = setTimeout(nextMole, level.interval);
    }

    createPlayground(3);
});
