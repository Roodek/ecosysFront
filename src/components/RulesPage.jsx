import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import GameTable from "./GameTable";
import "../stylesheets/GamePage.css"
import Ranking from "./Ranking";

const RulesPage = () => {
    return (
        <div>
            <p>TODO</p>
        </div>
    )
};

export default RulesPage;