import { useRef, useState } from "react";
import "./styles.css";

const Direction = {
  ToLeft: "ToLeft",
  ToRight: "ToRight"
};

const OpenedSide = {
  Left: "Left",
  Right: "Right"
};

export default function Swipeout({
  leftBtnsProps = [1, 2],
  rightBtnsProps = [3, 4]
}) {
  const isMoved = useRef(false);
  const isTouched = useRef(false);
  const isScrolling = useRef(undefined);
  const touchStartTime = useRef(0);
  const contentContainerRef = useRef(null);
  const leftBtnsContainerRef = useRef(null);
  const rightBtnsContainerRef = useRef(null);
  const leftBtnsContainerWidth = useRef(0);
  const rightBtnsContainerWidth = useRef(0);
  const touchesStart = useRef({ x: 0, y: 0 });
  const openedBtnsSide = useRef(null);
  const direction = useRef(undefined);
  const touchesDiff = useRef(0);
  const [translate, setTranslate] = useState(0);
  const [isOpened, setIsOpened] = useState(false);

  const leftBtnsRender = () => {
    return leftBtnsProps.map((btnProp, index) => {
      return <div className="swipeout-action-btn">{index}</div>;
    });
  };

  const rightBtnsRender = () => {
    return rightBtnsProps.map((btnProp, index) => {
      return <div className="swipeout-action-btn">{index}</div>;
    });
  };

  const onTouchStart = (e) => {
    isMoved.current = false;
    isTouched.current = true;
    isScrolling.current = undefined;
    touchesStart.current.x = e.targetTouches
      ? e.targetTouches[0].pageX
      : e.pageX;
    touchesStart.current.y = e.targetTouches
      ? e.targetTouches[0].pageY
      : e.pageY;
    touchStartTime.current = new Date().getTime();

    if (leftBtnsContainerRef.current) {
      leftBtnsContainerWidth.current = leftBtnsContainerRef.current.offsetWidth;
    }

    if (rightBtnsContainerRef.current) {
      rightBtnsContainerWidth.current =
        rightBtnsContainerRef.current.offsetWidth;
    }
  };

  const onTouchMove = (e) => {
    if (!isTouched.current) {
      return null;
    }

    console.log("move");
    const pageX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX; // 移动中触摸到的点的 x 坐标位置
    const pageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY; // 移动中触摸到的点的 y 坐标位置
    if (typeof isScrolling.current === "undefined") {
      isScrolling.current = !!(
        isScrolling.current ||
        Math.abs(pageY - touchesStart.current.y) >
          Math.abs(pageX - touchesStart.current.x)
      );
    }

    if (isScrolling.current) {
      isTouched.current = false;
      return;
    }

    if (!isMoved.current) {
      if (leftBtnsProps.length > 0 && leftBtnsContainerRef.current) {
        leftBtnsContainerWidth.current =
          leftBtnsContainerRef.current.offsetWidth;
      }

      if (rightBtnsProps.length > 0 && rightBtnsContainerRef.current) {
        rightBtnsContainerWidth.current =
          rightBtnsContainerRef.current.offsetWidth;
      }
    }

    isMoved.current = true;
    if (e.cancelable) {
      e.preventDefault();
    }

    touchesDiff.current = pageX - touchesStart.current.x;
    let translate = touchesDiff.current;

    if (isOpened) {
      if (openedBtnsSide.current === OpenedSide.Left)
        translate -= leftBtnsContainerWidth.current;
      else translate += leftBtnsContainerWidth.current;
    }

    if (
      (translate > 0 && leftBtnsProps.length === 0) ||
      (translate < 0 && rightBtnsProps.length === 0)
    ) {
      if (!isOpened) {
        isTouched.current = false;
        isMoved.current = false;
        setTranslate(0);
        return;
      }
      translate = 0;
    }

    if (translate < 0) direction.current = Direction.ToLeft;
    else if (translate > 0) direction.current = Direction.ToRight;
    else if (!direction.current) direction.current = Direction.ToLeft;

    let buttonOffset = 0;
    let progress;

    if (rightBtnsProps.length > 0) {
      // Show right actions
      let buttonTranslate = translate;
      progress = buttonTranslate / rightBtnsContainerWidth.current;
      if (buttonTranslate < -rightBtnsContainerWidth.current) {
        buttonTranslate =
          -rightBtnsContainerWidth.current -
          (-buttonTranslate - rightBtnsContainerWidth.current) ** 0.8;
        translate = buttonTranslate;
      }

      if (direction.current !== Direction.ToLeft) {
        progress = 0;
        buttonTranslate = 0;
      }
      const newTranslate =
        buttonTranslate - buttonOffset * (1 + Math.max(progress, -1));
      console.log(newTranslate);
      setTranslate(newTranslate);
    }
  };

  const onTouchEnd = (e) => {
    // 方向: 左/右
    // 动作: 打开/关闭
    if (!isTouched.current || !isMoved.current) {
      isTouched.current = false;
      isMoved.current = false;
      return;
    }

    isTouched.current = false;
    isMoved.current = false;
    const timeDiff = new Date().getTime() - touchStartTime.current;
    const $actions =
      direction.current === Direction.ToLeft
        ? rightBtnsContainerRef
        : leftBtnsContainerRef;
    const actionsWidth = (direction === Direction.ToLeft
      ? rightBtnsContainerWidth
      : leftBtnsContainerWidth
    ).current;

    let action;
    let $buttons;
    let i;

    if (
      (timeDiff < 300 &&
        ((translate < -10 && direction === Direction.ToLeft) ||
          (translate > 10 && direction === Direction.ToRight))) ||
      (timeDiff >= 300 && Math.abs(translate) > actionsWidth / 2)
    ) {
      action = "open";
    } else {
      action = "close";
    }

    if (timeDiff < 300) {
      if (Math.abs(translate) === 0) action = "close";
      if (Math.abs(translate) === actionsWidth) action = "open";
    }

    // if (action === "open") {
    // }

    const newTranslate =
      direction === Direction.ToLeft ? -actionsWidth : actionsWidth;
    setTranslate(0);
  };

  return (
    <div>
      <div>translate: {translate}</div>
      <div className="swipeout-container">
        <div
          ref={contentContainerRef}
          style={{ transform: `translate3d(${translate}px, 0, 0)` }}
          className="swipeout-content"
          onMouseDown={onTouchStart}
          onMouseMove={onTouchMove}
          onMouseUp={onTouchEnd}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        ></div>
        <div
          className="swipeout-left-btns-container"
          ref={leftBtnsContainerRef}
        >
          {leftBtnsRender()}
        </div>
        <div
          className="swipeout-right-btns-container"
          ref={rightBtnsContainerRef}
        >
          {rightBtnsRender()}
        </div>
      </div>
    </div>
  );
}
