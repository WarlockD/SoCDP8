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

import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Box, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { DF32Model } from "../../../models/peripherals/DF32Model";
import { KW8IModel } from "../../../models/peripherals/KW8IModel";
import { PC04Model } from "../../../models/peripherals/PC04Model";
import { PeripheralModel } from "../../../models/peripherals/PeripheralModel";
import { PT08Model } from "../../../models/peripherals/PT08Model";
import { RF08Model } from "../../../models/peripherals/RF08Model";
import { RK08Model } from "../../../models/peripherals/RK08Model";
import { RK8EModel } from "../../../models/peripherals/RK8EModel";
import { TC08Model } from "../../../models/peripherals/TC08Model";
import { DF32 } from "./DF32";
import { KW8I } from "./KW8I";
import { PC04 } from "./PC04";
import { PT08 } from "./PT08";
import { RF08 } from "./RF08";
import { RK08 } from "./RK08";
import { RK8E } from "./RK8E";
import { TC08 } from "./TC08";

export function PeripheralBox(props: {model: PeripheralModel}) {
    const model = props.model;
    let caption = "";
    let component = <></>;

    if (model instanceof PT08Model) {
        caption = "PT08 Serial Line";
        component = <PT08 model={model} />;
    } else if (model instanceof PC04Model) {
        caption = "PC04 High-Speed Paper-Tape Reader and Punch";
        component = <PC04 model={model} />;
    } else if (model instanceof TC08Model) {
        caption = "TC08 DECtape Control";
        component = <TC08 model={model} />;
    } else if (model instanceof RF08Model) {
        caption = "RF08 Disk Control";
        component = <RF08 model={model} />;
    } else if (model instanceof DF32Model) {
        caption = "DF32 Disk Control";
        component = <DF32 model={model} />;
    } else if (model instanceof RK08Model) {
        caption = "RK08 Disk Control";
        component = <RK08 model={model} />;
    } else if (model instanceof RK8EModel) {
        caption = "RK8E Disk Control";
        component = <RK8E model={model} />;
    } else if (model instanceof KW8IModel) {
        caption = "KW8I Real Time Clock";
        component = <KW8I model={model} />;
    }

    const titleStr = `${caption} @ Bus ${model.connections.map(x => x.toString(8)).join(", ")}`;
    return (
        <Box mb={3}>
            <Card variant="outlined">
                <CardHeader
                    title={titleStr}
                    action={
                        <IconButton component={RouterLink} to={`/peripherals/${model.id}`} title="Display only this">
                            <FullscreenIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    { component }
                </CardContent>
            </Card>
        </Box>
    );
}
