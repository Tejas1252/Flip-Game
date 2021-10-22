console.log('Updated!!');
let mainContainer = new createjs.Stage(`cvs`);
mainContainer.width = 600;
mainContainer.height = 60;
class Game {
  constructor(id, n, rectSize, startX, startY, color, textSize) {
    this.id = id;
    this.rect = new createjs.Shape();
    this.rectSize = rectSize;
    this.numberOfRects = n;
    this.rectSpace = 60 / 100 * rectSize;
    this.textSpace = rectSize + 30 / 100 * rectSize;
    this.container = new createjs.Container();
    this.containerStartX = startX;
    this.containerStartY = startY;
    this.numbersArray = [];
    this.secondArray = [];
    this.rectColor = color;
    this.textColor = "red";
    this.resState = {};
    this.textSize = textSize;
    this.score = 0;
    this.inner = [];
    this.xValues = [];
    this.click = 0;
    this.counter = 0;
    this.generateNumbers();
    this.numbersArray = _.shuffle(this.numbersArray)
    this.init();
    this.setIds();
    this.mouseHandlers = this.mouseHandlers.bind(this);
    this.tll = new TimelineLite();
    // this.doit = this.doit.bind(this);
    this.container.addEventListener("mousedown", this.mouseHandlers);
    window.obj = this;
  }

  generateNumbers() {
    let k = 1;
    if (this.numberOfRects % 2 === 0) {
      for (let i = 0; i < this.numberOfRects; i++) {
        for (let j = 0; j < this.numberOfRects; j++) {
          if (
            this.numbersArray.length ===
            this.numberOfRects * this.numberOfRects
          )
            return;
          this.numbersArray.push(k, k);
          k++;
        }
      }
    } else {
      this.numbersArray.push(-1);
      for (let i = 0; i < this.numberOfRects; i++) {
        for (let j = 0; j < this.numberOfRects; j++) {
          if (
            this.numbersArray.length ===
            this.numberOfRects * this.numberOfRects
          )
            return;
          this.numbersArray.push(k, k);
          k++;
        }
      }
    }
  }

  init() {
    for (let i = 0; i < this.numberOfRects; i++) {
      for (let j = 0; j < this.numberOfRects; j++) {
        const temp = this.numbersArray[this.counter];
        this.counter++;
        this.secondArray.push(temp);
        this.createContaier(
          i * this.rectSpace,
          j * this.rectSpace,
          i * this.textSpace + 10,
          j * this.textSpace + 10,
          temp
        );
      }
    }
  }

  mouseHandlers(e) {
    // console.log('e', e, this);
    e.target.id === -1 ? null : this.click++;
    if (e.target.id === -1) {
      this.flip(e.target)
      this.flipReverse(e.target);
      new TimelineLite().to(e.target, 1, {
        onComplete: function () {
          e.target.graphics._fill.style = "red";
        }
      })
      new TimelineLite().to(e.target, 1, {
        onComplete: function () {
          e.target.visible = true;
        }
      })
    } else {
      const id = this.id;
      this.flip(e.target)
      this.resState[e.target.id] = e.target;
      e.target.mouseEnabled = false;
      if (this.click === 2 && Object.keys(this.resState).length === 1) {
        Object.entries(this.resState).map((entry) => {
          let value = entry[1];
          this.inner.push(value);
        });
        this.click = 0;
        this.inner = [];
        Object.keys(this.resState = {});
        this.score++;
        if (this.numberOfRects % 2 === 0) {
          if (this.score === this.numberOfRects * this.numberOfRects / 2)
            new TimelineLite().to(e.target, 1, {
              onComplete: function () {
                alert(`Game ${id + 1} Vctory!!`);
              }
            });

        }
        else {
          if (this.score === (this.numberOfRects * this.numberOfRects - 1) / 2)
            new TimelineLite().to(e.target, 1, {
              onComplete: function () {
                alert(`Game ${id + 1} Victory!!`);
              }
            });
        }
      }
      else if (this.click === 2 && Object.keys(this.resState).length !== 1) {
        Object.entries(this.resState).map((entry) => {
          let value = entry[1];
          this.xValues.push(value.x);
          this.inner.push(value);
        });
        const first = this.inner[0];
        const second = this.inner[1];
        // console.log("incorrect");
        this.flipReverse(this.inner[0]);
        this.flipReverse(this.inner[1]);

        this.inner = []
        this.tll.to(e.target, 1, {
          onComplete: function () {
            first.visible = true;
            first.mouseEnabled = true;
            second.visible = true;
            second.mouseEnabled = true;
          }
        })
        Object.keys(this.resState = {});
        this.click = 0;
      }
    }
  }

  flip(box) {
    // console.log('flip');
    var tl = new TimelineLite();
    tl.to(box.graphics.command, 0.5, { x: box.x - this.containerStartX + this.rectSize, w: 0 });
  }

  flipReverse(box) {
    // console.log('reverse');
    var tl = new TimelineLite();
    tl.to(box.graphics.command, 0.5, { x: box.x - this.containerStartX + this.rectSize, w: 0 });
    tl.to(box.graphics.command, 0.5, { x: box.x - this.containerStartX, w: this.rectSize });
  }


  createContaier(x, y, x2, y2, ut) {
    const rect = new createjs.Shape();
    rect.graphics
      .beginFill(this.rectColor)
      .drawRect(x, y, this.rectSize, this.rectSize);
    rect.x = x + this.containerStartX;
    rect.y = y + this.containerStartY;

    const text = new createjs.Text(ut, `${this.textSize}px Arial`, this.textColor);
    text.x = x2 + this.containerStartX;
    text.y = y2 + this.containerStartY;
    text.mouseEnabled = false;

    this.container.addChild(text);
    this.container.addChild(rect);
    mainContainer.addChild(this.container);
  }

  setIds() {
    let g = 0;
    for (let i = 0; i < mainContainer.children[this.id].children.length; i++) {
      if (i % 2 !== 0) {
        const tt = this.secondArray[g];
        mainContainer.children[this.id].children[i].id = tt;
        g++;
      } else {
        const tt = this.secondArray[g];
        mainContainer.children[this.id].children[i].id = tt;
      }
    }
  }
}
createjs.Ticker.addEventListener("tick", handleTick);
function handleTick(event) {
  mainContainer.update();
}


//Game(id, n, rectSize, startX, startY, color,canvasWidth,canvasHeight,textSize) {
const obj = new Game(0, 2, 40, 35, 20, "blue", 18);
const obj2 = new Game(1, 2, 40, 150, 20, "green", 30);