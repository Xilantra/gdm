/*
* SPOILER ALERT! 
* WORDS FOR THE GAME ARE IN THIS FILE ;)
* ©2014 Nate Wiley -- MIT License
Sounds from http://soundfxnow.com, and http://www.soundjay.com
*/
(function($, window, undefined){

  Tekelerr = {
    init: function(words){
      this.words = words,
      this.hm = $(".tekelerr"),
      this.msg = $(".message"),
      this.msgTitle = $(".title"),
      this.msgText = $(".text"),
      this.restart = $(".restart"),
      this.wrd = this.randomWord(),
      this.correct = 0,
      this.guess = $(".guess"),
      this.wrong = $(".wrong"),
      this.wrongGuesses = [],
      this.rightGuesses = [],
      this.guessForm = $(".guessForm"),
      this.guessLetterInput = $(".guessLetter"),
      this.goodSound = new Audio("fx/goodbell.mp3"),
      this.badSound = new Audio("fx/bad.mp3"),
      this.winSound = new Audio("fx/win.mp3"),
      this.loseSound = new Audio("fx/lose.mp3"),
      this.setup();
    },


    setup: function(){
      this.binding();
      this.sounds();
      this.showGuess(this.wrongGuesses);
      this.showWrong();
    },

    
    sounds: function(){  
      this.badSound.volume = .4;
      this.goodSound.volume = .4;
      this.winSound.volume = .8;
      this.loseSound.volume = .4;
    },
    
    binding: function(){
      this.guessForm.on("click", $.proxy(this.theGuess, this));
      this.restart.on("click", $.proxy(this.theRestart, this));
    },


    playSound: function(sound){
      this.stopSound(sound);
      this[sound].play();
    },


    stopSound: function(sound){
      this[sound].pause();
      this[sound].currentTime = 0;
    },


    theRestart: function(e){
      e.preventDefault();
      this.stopSound("winSound");
      this.stopSound("loseSound");
      this.reset();
    },


    theGuess: function(e){
      e.preventDefault();
      var guess = this.guessLetterInput.val();
      if(guess.match(/[a-zA-Z]/) && guess.length == 1){
        if($.inArray(guess, this.wrongGuesses) > -1 || $.inArray(guess, this.rightGuesses) > -1){
          this.playSound("badSound");
          this.guessLetterInput.val("").focus();
        }
        else if(guess) {
          var foundLetters = this.checkGuess(guess);
          if(foundLetters.length > 0){
            this.setLetters(foundLetters);
            this.playSound("goodSound");
            this.guessLetterInput.val("").focus();
          } else {
            this.wrongGuesses.push(guess);
            if(this.wrongGuesses.length == 10){
              this.lose();
            } else {
              this.showWrong(this.wrongGuesses);
              this.playSound("badSound");
            }
            this.guessLetterInput.val("").focus();
          }
        }
      } else {
        this.guessLetterInput.val("").focus();
      }
    },

    randomWord: function(){
      return this._wordData(this.words[ Math.floor(Math.random() * this.words.length)] );
    },


    showGuess: function(){
      var frag = "<ul class='word'>";
      $.each(this.wrd.letters, function(key, val){
        frag += "<li data-pos='" +  key  + "' class='letter'>*</li>";
      });
      frag += "</ul>";
      this.guess.html(frag);
    },

    showWrong: function(wrongGuesses){
      if(wrongGuesses){
        var frag = "<ul class='wrongLetters'>";
        frag += "<p>Nope: </p>";
        $.each(wrongGuesses, function(key, val){
          frag += "<li>" + val + "</li>";
        });
        frag += "</ul>";
      }
      else {
        frag = "";
      }

      this.wrong.html(frag);
    },


    checkGuess: function(guessedLetter){
      var _ = this;
      var found = [];
      $.each(this.wrd.letters, function(key, val){
        if(guessedLetter == val.letter.toLowerCase()){
          found.push(val);
          _.rightGuesses.push(val.letter);
        }
      });
      return found;

    },


    setLetters: function(letters){
      var _ = this;
      _.correct = _.correct += letters.length;
      $.each(letters, function(key, val){
        var letter = $("li[data-pos=" +val.pos+ "]");
        letter.html(val.letter);
        letter.addClass("correct");

        if(_.correct  == _.wrd.letters.length){
          _.win();
        }
      });
    },


    _wordData: function(word){

      return {
        letters: this._letters(word),
        word: word.toLowerCase(),
        totalLetters: word.length
      };
    },


    hideMsg: function(){
      this.msg.hide();
      this.msgTitle.hide();
      this.restart.hide();
      this.msgText.hide();
        $("core-drawer-panel").removeClass("blur-bg");
    },


    showMsg: function(){
      var _ = this;
        $("core-drawer-panel").addClass("blur-bg");
      _.msg.show("blind", function(){
        _.msgTitle.show("bounce", "slow", function(){
          _.msgText.show("slide", function(){
            _.restart.show("fade");
          });

        });

      });
    },


    reset: function(){
      this.hideMsg();
      this.init(this.words);
      this.hm.find(".guessLetter").focus();

    },


    _letters: function(word){
      var letters = [];
      for(var i=0; i<word.length; i++){
        letters.push({
          letter: word[i],
          pos: i
        });
      }
      return letters;
    },


    rating: function(){
      var right = this.rightGuesses.length,
          wrong = this.wrongGuesses.length || 0,
          rating = {
            rating: Math.floor(( right / ( wrong + right )) * 100),
            guesses: (right + wrong)
            
          };
      return rating;
    },

    win: function(){
      var rating = this.rating();
      this.msgTitle.html("Brilliant! A true artist!");
      // this is messy
      this.msgText.html("Good job, Massimo Vignelli must be proud of you because you solved it in <span class='highlight'>" + rating.guesses + "</span> guesses!<br><small>Your design level: <span class='highlight'>" + rating.rating + "%</span><small>");
      this.showMsg(); 
      this.playSound("winSound");
    },


    lose: function(){
      this.msgTitle.html("No..<br>The answer is <span class='highlight'>"+ this.wrd.word +"</span>");
      this.msgText.html("It's okay, perhaps it's time to learn more?");
      this.showMsg();
      this.playSound("loseSound");
    }
  
  };

  var wordList = ["visual", "proof", "magazine", "digital", "text", "images", "coffee", "inspiration", "print", "palette", "layout", "layer", "wireframe", "mockup", "designer", "bleed", "postcard", "banner", "creative", "drawing", "color", "illustration", "block", "alignment", "header", "typography", "responsive", "justified", "css", "border", "serif", "helvetica", "pixel", "retina", "typeface", "copyfitting", "kerning", "leading", "margin", "dpi", "pattern", "raster", "vector", "photoshop", "sketch", "illustrator", "cmyk", "rgb", "art", "logo", "gaussian", "radial", "icon", "symmetri", "asymmetric", "motion", "shape", "flash", "crosshatch", "font", "identity", "branding", "favicon", "monochrome", "gradient", "bauhaus", "victorian", "futurism", "swiss", "psychedelic", "minimalism", "advertising", "copywriting", "portfolio", "commercial", "critique", "storyboard", "geometry", "figure", "pencil", "aiga", "pastel",  "deepskyblue", "template", "watercolor", "smudge", "lithography", "doctype", "gestalt", "webgl", "canvas", "interface", "animation"];

  Tekelerr.init(wordList);
  
})(jQuery, window);