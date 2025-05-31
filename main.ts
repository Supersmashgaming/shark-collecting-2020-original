namespace SpriteKind {
    export const Wall = SpriteKind.create()
    export const Coin = SpriteKind.create()
    export const UI = SpriteKind.create()
}
function eventCall () {
    Event = randint(1, 6)
    if (Event == 1) {
        bulletSharkSpeed = bulletSharkSpeed / 2
        music.magicWand.play()
        eventText.setText("Bullet Sharks speed halved")
        eventTextCall()
        Event = 0
    } else if (Event == 2) {
        music.jumpUp.play()
        info.changeLifeBy(1)
        eventText.setText("Extra Life")
        eventTextCall()
        Event = 0
    } else if (Event == 3) {
        music.buzzer.play()
        eventText.setText("Lucky you! Nothing!")
        eventTextCall()
        Event = 0
    } else if (Event == 4) {
        bulletSharkSpeed = bulletSharkSpeed * 2
        music.zapped.play()
        eventText.setText("Bullet Sharks speed doubled")
        eventTextCall()
        Event = 0
    } else if (Event == 5) {
        music.buzzer.play()
        eventText.setText("Lucky you! Nothing!")
        eventTextCall()
        Event = 0
    } else if (Event == 6) {
        music.buzzer.play()
        eventText.setText("Lucky you! Nothing!")
        eventTextCall()
        Event = 0
    }
    statusbar.value = 0
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStart == true) {
        game.splash("Kill button pushed", "Commencing protocol " + info.score())
        if (info.score() == 101) {
            info.changeLifeBy(3)
            music.powerUp.play()
        } else {
            info.setLife(0)
        }
    }
})
sprites.onOverlap(SpriteKind.Coin, SpriteKind.Player, function (sprite, otherSprite) {
    sprite.destroy(effects.confetti, 500)
    statusbar.value += 1
    music.baDing.play()
})
function setPlayer () {
    BB = sprites.create(assets.image`Player`, SpriteKind.Player)
    BB.setFlag(SpriteFlag.StayInScreen, true)
    info.setLife(3)
    wall = sprites.create(assets.image`Net`, SpriteKind.Wall)
    wall.setPosition(3, 60)
    BB.setPosition(18, 60)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStart == true) {
        BB.setVelocity(0, -50)
        BB.ay = 100
    }
})
function startGame () {
    eventText = textsprite.create("-Normal Game-", 1, 15)
    menuTitle.ax = 100
    menuTitle2.ax = -100
    gameStart = true
    setSystem()
    setHiScore()
    setPlayer()
    setCoinBar()
    eventTextCall()
}
function setBackground () {
    scene.setBackgroundColor(9)
    effects.clouds.startScreenEffect()
}
function setMenu () {
    menu = [
    "Play Normal Game",
    "Play Coin Game",
    "How to Play",
    "Options..."
    ]
    menuOpen = true
    menu2 = [
    "Change Coin Max = " + blockSettings.readNumber("coinMax"),
    "View Hi-Scores",
    "Reset Hi-Scores",
    "<- Back"
    ]
    menu2Open = false
    blockMenu.setColors(8, 1)
    menuTitle = textsprite.create("Shark Collecting", 1, 15)
    menuTitle.setPosition(80, 25)
    menuTitle2 = textsprite.create("Game by supersmashgaming", 1, 15)
    menuTitle2.setPosition(80, 45)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    otherSprite.destroy(effects.ashes, 500)
    info.changeLifeBy(-1)
    if (info.life() > 0) {
        scene.cameraShake(4, 500)
    }
    if (info.life() > 1) {
        music.powerDown.play()
    } else if (info.life() > 0) {
        music.siren.play()
    } else {
    	
    }
    pause(3000)
})
function setCoinBar () {
    if (coinGame == true) {
        statusbar = statusbars.create(60, 12, StatusBarKind.Energy)
        statusbar.setColor(5, 1)
        statusbar.setBarBorder(1, 3)
        statusbar.positionDirection(CollisionDirection.Top)
        statusbar.setOffsetPadding(0, -1)
        statusbar.max = blockSettings.readNumber("coinMax")
        statusbar.value = 0
        eventText.setText("-Coin Game-")
    }
}
info.onLifeZero(function () {
    if (info.score() > info.highScore()) {
        if (coinGame == true) {
            blockSettings.writeNumber("coinHiScore", info.score())
        } else {
            blockSettings.writeNumber("normalHiScore", info.score())
        }
        game.over(true)
    } else {
        game.over(false)
    }
})
function eventTextCall () {
    eventText.setPosition(200, 115)
    eventText.setMaxFontHeight(1)
    eventText.setVelocity(-100, 0)
}
function setHiScore () {
    if (coinGame == true) {
        settings.writeNumber("high-score", blockSettings.readNumber("coinHiScore"));
    } else {
        settings.writeNumber("high-score", blockSettings.readNumber("normalHiScore"));
    }
}
statusbars.onStatusReached(StatusBarKind.Energy, statusbars.StatusComparison.EQ, statusbars.ComparisonType.Percentage, 100, function (status) {
    eventCall()
})
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Wall, function (sprite, otherSprite) {
    sprite.destroy(effects.confetti, 500)
    info.changeScoreBy(1)
})
function setSystem () {
    info.setScore(0)
    sharkSpeed = -50
    bulletSharkSpeed = -80
    difficulty = 20
    level = 0
    extraLife = 50
    console.log("Life")
    console.log("Score")
    console.log("Level")
}
statusbars.onZero(StatusBarKind.Energy, function (status) {
	
})
blockMenu.onMenuOptionSelected(function (option, index) {
    if (blockMenu.isMenuOpen()) {
        if (menuOpen == true) {
            if (option == menu[0]) {
                blockMenu.closeMenu()
                startGame()
            } else if (option == menu[1]) {
                coinGame = true
                blockMenu.closeMenu()
                startGame()
            } else if (option == menu[2]) {
                game.showLongText("\\n Press the A button to fly and avoid sharks. \\n If playing coin game, collect enough coins to cause a random event.", DialogLayout.Bottom)
            } else if (option == menu[3]) {
                menuOpen = false
                menu2Open = true
                blockMenu.showMenu(menu2, MenuStyle.List, MenuLocation.BottomHalf)
            }
        } else if (menu2Open == true) {
            if (option == menu2[0]) {
                blockSettings.writeNumber("coinMax", game.askForNumber("Set new coin max. (5-99)", 2))
                if (blockSettings.readNumber("coinMax") < 5) {
                    game.splash("Coin max must be 5 or higher.")
                    blockSettings.writeNumber("coinMax", 5)
                }
            } else if (option == menu2[1]) {
                game.splash("Normal Hi-Score: " + blockSettings.readNumber("normalHiScore"), "Coin Hi-Score: " + blockSettings.readNumber("coinHiScore"))
            } else if (option == menu2[2]) {
                if (game.ask("Are you sure?", "(Can not be undone.)")) {
                    blockSettings.writeNumber("normalHiScore", 0)
                    blockSettings.writeNumber("coinHiScore", 0)
                }
            } else if (option == menu2[3]) {
                menuOpen = true
                menu2Open = false
                blockMenu.showMenu(menu, MenuStyle.List, MenuLocation.BottomHalf)
            }
        }
    }
})
let coin: Sprite = null
let projectile: Sprite = null
let highScore = 0
let score = 0
let life = 0
let extraLife = 0
let level = 0
let difficulty = 0
let sharkSpeed = 0
let coinGame = false
let menu2Open = false
let menu2: string[] = []
let menuOpen = false
let menuTitle2: TextSprite = null
let menuTitle: TextSprite = null
let wall: Sprite = null
let BB: Sprite = null
let gameStart = false
let statusbar: StatusBarSprite = null
let eventText: TextSprite = null
let bulletSharkSpeed = 0
let Event = 0
let menu: string[] = []
storyboard.ColorSSGBootSequence.register()
storyboard.start("")
setMenu()
setBackground()
blockMenu.showMenu(menu, MenuStyle.List, MenuLocation.BottomHalf)
game.onUpdate(function () {
    life = info.life()
    score = info.score()
    highScore = info.highScore()
})
game.onUpdate(function () {
    menu2 = [
    "Change Coin Max = " + blockSettings.readNumber("coinMax"),
    "View Hi-Scores",
    "Reset Hi-Scores",
    "<- Back"
    ]
})
game.onUpdateInterval(5000, function () {
    if (gameStart == true) {
        if (info.score() > difficulty) {
            bulletSharkSpeed += -20
            difficulty += 100
            level += 1
        }
        projectile = sprites.createProjectileFromSide(assets.image`Shark Bullet`, bulletSharkSpeed, 0)
        projectile.setPosition(170, randint(0, 120))
    }
})
game.onUpdateInterval(5000, function () {
    if (gameStart == true) {
        if (coinGame == true) {
            coin = sprites.create(assets.image`chancecoin`, SpriteKind.Coin)
            coin.setPosition(160, randint(0, 120))
            coin.setVelocity(-30, 0)
        }
    }
})
game.onUpdateInterval(1000, function () {
    if (gameStart == true) {
        if (info.score() >= extraLife) {
            info.changeLifeBy(1)
            music.powerUp.play()
            extraLife += 50
        }
        if (info.score() > difficulty) {
            bulletSharkSpeed += -20
            difficulty += 10
            level += 1
        }
        projectile = sprites.createProjectileFromSide(assets.image`Shark`, sharkSpeed, 0)
        projectile.setPosition(170, randint(0, 120))
    }
})
