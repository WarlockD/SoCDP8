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

import { IOController } from '../IOController';
import { IOConfigEntry } from '../IOConfigEntry';

export class ASR33 {
    private READER_ID = 3;
    private PUNCH_ID = 4;
    private io: IOController;

    public constructor(io: IOController) {
        this.io = io;
        this.setupReader();
        this.setupPunch();
    }

    private setupReader(): void {
        let readerEntry = new IOConfigEntry(this.READER_ID);

        // IOP1 for reader: Skip if flag is set
        readerEntry.iopForSkipFlag = 1;

        // IOP2 for reader: Clear AC, Clear Flag, generate IRQ so we can reload and request to call us
        readerEntry.iopForACClear = 2;
        readerEntry.iopForFlagClear = 2;
        readerEntry.iopForInterrupt = 2;
        readerEntry.onFlagUnset = () => this.onReaderFlagReset();

        // IOP4 for reader: Load AC with register
        readerEntry.iopForACLoad = 3;

        // Writing data to register should set the flag
        readerEntry.setFlagOnWrite = true;

        this.io.registerDevice(readerEntry);
    }

    private setupPunch(): void {
        let punchEntry = new IOConfigEntry(this.PUNCH_ID);

        // IOP1 for punch: Skip if flag is set
        punchEntry.iopForSkipFlag = 1;

        // IOP2 for reader: Clear Flag, generate IRQ so we can retrieve the data
        punchEntry.iopForFlagClear = 2;
        punchEntry.iopForInterrupt = 2;
        punchEntry.onFlagUnset = () => this.onPunchFlagReset();

        // IOP4 for reader: Load register with AC
        punchEntry.iopForRegisterLoad = 3;

        // Writing data to register should set the flag
        punchEntry.setFlagOnWrite = true;

        this.io.registerDevice(punchEntry);
    }
    
    private onReaderFlagReset(): void {
        this.io.writeDeviceRegister(this.READER_ID, 0o1234);
    }

    private onPunchFlagReset(): void {
        let [data, isNew] = this.io.readDeviceRegister(this.PUNCH_ID);
        if (isNew) {
            let char = data & 0x7F;
            this.io.writeDeviceRegister(this.PUNCH_ID, 0);
            console.log('Got ' + char);
        }
    }
}
