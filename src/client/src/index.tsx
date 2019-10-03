/*
 *   SoCDP8 - A PDP-8/I implementation on a SoC
 *   Copyright (C) 2019 Folke Will <folko@solhost.org>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

 import * as React from "react";
import * as ReactDOM from "react-dom";
import { PDP8Console, LampState, SwitchState } from './components/PDP8Console/PDP8Console';
import io from 'socket.io-client';
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";

async function main() {
    let socket = io();
    let app = feathers();
    app.configure(socketio(socket));
    
    let state = await app.service('console').find();

    let lamps: LampState = state.lamps;
    let switches: SwitchState = state.switches;
    
    let cons = <PDP8Console lamps={lamps} switches={switches} />;
    ReactDOM.render(cons, document.getElementById("main"));
}

main();
