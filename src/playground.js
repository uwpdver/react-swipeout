import { StrictMode } from "react";
import ReactDOM from "react-dom";

import Swipeout from "./Swipeout";

const rootElement = document.getElementById("root");
ReactDOM.render(
    <StrictMode>
        <Swipeout
            leftBtnsProps={[1, 2]}
            ghtBtnsProps={[3, 4, 5]}
        />
    </StrictMode>,
    rootElement
);