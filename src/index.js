import { StrictMode } from "react";
import ReactDOM from "react-dom";
import Swipeout from "./Swipeout";
import './index.css';

const swipeoutList = [
    {
        type: 'label',
        text: 'Cant Swipe',
    },
    {
        content: '雨下整夜我的爱溢出就像雨水，窗台蝴蝶像诗里纷飞的美丽章节。我接着写把永远爱你写进诗的结尾，你是我唯一想要的了解。'
    },
    {
        type: 'label',
        text: 'Right',
    },
    {
        rightBtnsProps: [
            {
                className: 'bg-yellow',
                text: 'Delete',
                onClick: () => { alert('wuhu~ Delete') },
            }
        ],
        content: '雨下整夜我的爱溢出就像雨水，窗台蝴蝶像诗里纷飞的美丽章节。我接着写把永远爱你写进诗的结尾，你是我唯一想要的了解。'
    },
    {
        type: 'label',
        text: 'Left',
    },
    {
        leftBtnsProps: [
            {
                className: 'bg-yellow',
                text: 'Delete',
                onClick: () => { alert('wuhu~ Delete') },
            }
        ],
        content: '雨下整夜我的爱溢出就像雨水，窗台蝴蝶像诗里纷飞的美丽章节。我接着写把永远爱你写进诗的结尾，你是我唯一想要的了解。'
    },
    {
        type: 'label',
        text: 'Right without Confirm',
    },
    {
        rightBtnsProps: [
            {
                className: 'bg-yellow',
                text: 'Delete',
                onClick: () => console.log('wuhu~ Delete'),
            }
        ],
        content: '雨下整夜我的爱溢出就像雨水，窗台蝴蝶像诗里纷飞的美丽章节。我接着写把永远爱你写进诗的结尾，你是我唯一想要的了解。'
    },
    {
        type: 'label',
        text: 'Both',
    },
    {
        leftBtnsProps: [
            {
                className: 'bg-yellow',
                text: 'Mark',
                onClick: () => { alert('wuhu~ Mark') },
            }
        ],
        rightBtnsProps: [
            {
                className: 'bg-red',
                text: 'Delete',
                onClick: () => { alert('wuhu~ Delete') },
            }
        ],
        content: '雨下整夜我的爱溢出就像雨水，窗台蝴蝶像诗里纷飞的美丽章节。我接着写把永远爱你写进诗的结尾，你是我唯一想要的了解。'
    },
    {
        type: 'label',
        text: 'Muti-Button',
    },
    {
        rightBtnsProps: [
            {
                className: 'bg-yellow',
                text: 'Mark',
                onClick: () => { alert('wuhu~ Mark') },
            },
            {
                className: 'bg-blue',
                text: 'More',
                onClick: () => { alert('wuhu~ More') },
            },
            {
                className: 'bg-red',
                text: 'Delete',
                onClick: () => { alert('wuhu~ Delete') },
            }
        ],
        content: '雨下整夜我的爱溢出就像雨水，窗台蝴蝶像诗里纷飞的美丽章节。我接着写把永远爱你写进诗的结尾，你是我唯一想要的了解。'
    },
    {
        type: 'label',
        text: 'Both muti-Button',
    },
    {
        leftBtnsProps: [
            {
                className: 'bg-red',
                text: 'Delete',
                onClick: () => { alert('wuhu~ Delete') },
            },
            {
                className: 'bg-blue',
                text: 'More',
                onClick: () => { alert('wuhu~ More') },
            },
            {
                className: 'bg-yellow',
                text: 'Mark',
                onClick: () => { alert('wuhu~ Mark') },
            }
        ],
        rightBtnsProps: [
            {
                className: 'bg-yellow',
                text: 'Mark',
                onClick: () => { alert('wuhu~ Mark') },
            },
            {
                className: 'bg-blue',
                text: 'More',
                onClick: () => { alert('wuhu~ More') },
            },
            {
                className: 'bg-red',
                text: 'Delete',
                onClick: () => { alert('wuhu~ Delete') },
            }
        ],
        content: '雨下整夜我的爱溢出就像雨水，窗台蝴蝶像诗里纷飞的美丽章节。我接着写把永远爱你写进诗的结尾，你是我唯一想要的了解。'
    },
]

const rootElement = document.getElementById("root");
ReactDOM.render(
    <StrictMode>
        {
            swipeoutList.map(swipeProps => {
                if (swipeProps.type === 'label') {
                    return <div className="label">{swipeProps.text}</div>
                } else {
                    return <Swipeout {...swipeProps}>{swipeProps.content}</Swipeout>
                }
            })
        }
    </StrictMode>,
    rootElement
);

export default Swipeout;