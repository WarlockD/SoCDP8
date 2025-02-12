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

import { Box, Button, ButtonGroup, Card, CardActions, CardContent, Checkbox, Dialog, DialogTitle, FormControlLabel, List, ListItemButton, ListItemText } from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import { ProgramSnippet, ProgramSnippets } from "../../../models/ProgramSnippets";
import { SoCDP8 } from "../../../models/SoCDP8";
import { DeviceID } from "../../../types/PeripheralTypes";
import { downloadData, loadFile } from "../../../util";
import { UploadButton } from "../common/UploadButton";
import { FrontPanel } from "./FrontPanel";

export function FrontPanelBox(props: {pdp8: SoCDP8}) {
    const [throttle, setThrottle] = useState(true);
    const [busy, setBusy] = useState(false);
    const [showSnippets, setShowSnippets] = useState(false);
    const simSpeed = props.pdp8.useStore(state => state.simSpeed);
    const sys = props.pdp8.useStore(state => state.activeSystem!);

    async function saveState() {
        setBusy(true);
        await props.pdp8.saveCurrentState();
        setBusy(false);
    }

    async function loadSnippet(snippet: ProgramSnippet) {
        for (const s of snippet.snippets) {
            await props.pdp8.writeCore(s.start, s.data);
        }
        setShowSnippets(false);
    }

    async function toggleThrottle() {
        await props.pdp8.setThrottleControl(!throttle);
        setThrottle(!throttle);
    }

    async function uploadCore(files: FileList | null) {
        if (!files || files.length < 1) {
            return;
        }
        if (files[0].size > 65536) {
            alert(`File too big, max allowed size is ${65536} bytes.`);
            return;
        }
        const data = await loadFile(files[0]);
        await props.pdp8.loadCoreDump(data);
    }

    async function downloadCore() {
        const dump = await props.pdp8.getCoreDump()
        await downloadData(dump, "core.dat");
    }

    return (
        <Box mb={4}>
            <Card variant="outlined">
                <CardContent>
                    <FrontPanel pdp8={props.pdp8} />
                </CardContent>
                <CardActions>
                    <Stack direction="row" justifyContent="space-between" component={CardActions}>
                        <ButtonGroup variant="outlined">
                            <Button onClick={() => void saveState()} disabled={busy}>
                                Save State
                            </Button>
                            <Button onClick={() => setShowSnippets(true)}>
                                Load Snippet
                            </Button>
                            <UploadButton onSelect={files => void uploadCore(files)}>
                                Upload Dump
                            </UploadButton>
                            <Button onClick={() => void downloadCore()}>
                                Download Dump
                            </Button>
                            <Button onClick={() => void props.pdp8.clearCore()}>
                                Clear Core
                            </Button>
                            <SnippetDialog
                                open={showSnippets}
                                onClose={() => setShowSnippets(false)}
                                onSelect={(snippet) => void loadSnippet(snippet)}
                                devices={sys.peripherals.map(p => p.id)}
                            />
                        </ButtonGroup>
                        <Box sx={{alignSelf: "right"}}>
                            Emulation Speed: { simSpeed.toFixed(2) }
                            <FormControlLabel control={<Checkbox checked={throttle} onChange={() => void toggleThrottle()} />} label="Control" sx={{ml: 1}}/>
                        </Box>
                    </Stack>
                </CardActions>
            </Card>
        </Box>
    );
}

interface SnippetProps {
    onSelect: ((s: ProgramSnippet) => void);
    open: boolean, onClose: (() => void);
    devices: DeviceID[];
}

function SnippetDialog(props: SnippetProps) {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Select Snippet</DialogTitle>
            <List>
                { ProgramSnippets.filter(s => s.requirements.every(dev => props.devices.includes(dev))).map(snippet =>
                    <ListItemButton key={snippet.label} onClick={() => props.onSelect(snippet)}>
                        <ListItemText primary={snippet.label} secondary={snippet.desc} />
                    </ListItemButton>
                )}
            </List>
        </Dialog>
    );
}
