import { useRef, useState, useCallback } from "react";
import "./swipeout.css";

const Direction = {
  ToLeft: "ToLeft",
  ToRight: "ToRight"
};

const OpenedSide = {
  Left: "Left",
  Right: "Right"
};

export default function Swipeout({
  leftBtnsProps = [],
  rightBtnsProps = []
}) {
  const isMoved = useRef(false);
  const isTouched = useRef(false);
  const isScrolling = useRef(undefined);
  const touchStartTime = useRef(0);
  const swipeoutContainerRef = useRef(null);
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

  const getBtnTranslate = useCallback((indexFromMiddle, directionFlag, btnsContainerWidth, btnsNum) => {
    const isOverswipe = btnsContainerWidth < (directionFlag * translate);
    const btnWidth = 48;
    const baseOffset = directionFlag * btnWidth * indexFromMiddle;
    const speedRatio = (btnsNum - indexFromMiddle) / btnsNum
    const movedDistance = isOverswipe ? translate : (translate * speedRatio + baseOffset);
    return movedDistance;
  }, [translate])

  const leftBtnsRender = () => {
    return leftBtnsProps.map((btnProp, index) => {
      const indexFromMiddle = leftBtnsProps.length - 1 - index;
      const directionFlag = 1;
      const btnTranslate = getBtnTranslate(indexFromMiddle, directionFlag, leftBtnsContainerWidth.current, leftBtnsProps.length);
      const baseColorValue = `${indexFromMiddle * 4}`
      const color = `#${(new Array(7)).join(baseColorValue)}`
      return (
        <div
          className="swipeout-action-btn"
          style={{
            transform: `translate3d(${btnTranslate}px, 0px, 0px)`,
            background: color,
            zIndex: indexFromMiddle
          }}
        >
          <div>{btnProp}</div>
        </div>
      );
    });
  };

  const rightBtnsRender = () => {
    return rightBtnsProps.map((btnProp, index) => {
      const indexFromMiddle = index;
      const directionFlag = -1;
      const btnTranslate = getBtnTranslate(indexFromMiddle, directionFlag, rightBtnsContainerWidth.current, rightBtnsProps.length);
      const baseColorValue = `${indexFromMiddle * 4}`
      const color = `#${(new Array(7)).join(baseColorValue)}`
      return (
        <div
          className="swipeout-action-btn"
          style={{
            transform: `translate3d(${btnTranslate}px, 0px, 0px)`,
            background: color,
            zIndex: indexFromMiddle
          }}
        >
          <div>{btnProp}</div>
        </div>
      );
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

      swipeoutContainerRef.current.classList.remove('swipeout-transitioning');
    }

    isMoved.current = true;
    if (e.cancelable) {
      e.preventDefault();
    }

    let newTranslate = pageX - touchesStart.current.x;

    if (isOpened) {
      if (openedBtnsSide.current === OpenedSide.Left) {
        newTranslate -= leftBtnsContainerWidth.current;
      } else {
        newTranslate += leftBtnsContainerWidth.current
      };
    }

    if (
      (newTranslate > 0 && leftBtnsProps.length === 0) ||
      (newTranslate < 0 && rightBtnsProps.length === 0)
    ) {
      if (!isOpened) {
        isTouched.current = false;
        isMoved.current = false;
        setTranslate(0);
        return;
      }
      translate = 0;
    }

    if (newTranslate < 0) direction.current = Direction.ToLeft;
    else if (newTranslate > 0) direction.current = Direction.ToRight;
    else if (!direction.current) direction.current = Direction.ToLeft;
    setTranslate(newTranslate);
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
    const actionsWidth = (direction === Direction.ToLeft
      ? rightBtnsContainerWidth
      : leftBtnsContainerWidth
    ).current;

    let action;
    let $buttons;
    let i;

    // 根据当前的移动方向判断动作是 打开还是关闭
    if (
      (timeDiff < 300 &&
        ((translate < -10 && direction.current === Direction.ToLeft) ||
          (translate > 10 && direction.current === Direction.ToRight))) ||
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

    if (swipeoutContainerRef.current) {
      swipeoutContainerRef.current.classList.add('swipeout-transitioning')
    }

    if (action === "open") {
      const newTranslate =
        direction.current === Direction.ToLeft ? -actionsWidth : actionsWidth;
      setTranslate(newTranslate);
      setIsOpened(true)
      openedBtnsSide.current = direction.current === Direction.ToLeft ? OpenedSide.Left : OpenedSide.Right;
    } else if (action === 'close') {
      setTranslate(0);
      setIsOpened(false)
    }
  };

  const displayData = () => {
    const msg = `
    isMoved: ${isMoved.current}
    isTouched: ${isTouched.current}
    isScrolling: ${isScrolling.current}
    touchStartTime: ${touchStartTime.current}
    leftBtnsContainerWidth: ${leftBtnsContainerWidth.current}
    rightBtnsContainerWidth: ${rightBtnsContainerWidth.current}
    touchesStart: ${touchesStart.current.x}
    openedBtnsSide: ${openedBtnsSide.current}
    direction: ${direction.current}
    touchesDiff: ${touchesDiff.current}
    translate: ${translate}
    isOpened: ${isOpened}
    `
    console.info(msg);
  }

  return (
    <div>
      <div><button onClick={displayData}>fresh</button></div>
      <div className="swipeout-container" ref={swipeoutContainerRef}>
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
          style={{ transform: `translate3d(-100%, 0, 0)` }}
          ref={leftBtnsContainerRef}
        >
          {leftBtnsRender()}
        </div>
        <div
          className="swipeout-right-btns-container"
          style={{ transform: `translate3d(100%, 0, 0)` }}
          ref={rightBtnsContainerRef}
        >
          {rightBtnsRender()}
        </div>
      </div>
    </div>
  );
}
