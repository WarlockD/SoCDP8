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

import { Typography } from "@mui/material";
import { SoCDP8 } from "../../models/SoCDP8";
import { FrontPanelBox } from "../components/frontpanel/FrontPanelBox";
import { PeripheralBox } from "../components/peripherals/PeripheralBox";

export function SystemPage(props: {pdp8: SoCDP8}) {
    const peripherals = props.pdp8.useStore(state => state.peripheralModels);
    const sys = props.pdp8.useStore(state => state.activeSystem)!;

    const models = [...peripherals.values()];

    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom>
                System: {sys.name}
            </Typography>

            <FrontPanelBox pdp8={props.pdp8} />

            { models.map((dev, i) => <PeripheralBox key={i} model={dev} />) }
        </>
    );
}
