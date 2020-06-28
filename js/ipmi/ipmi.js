(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.p_edf = exports.p_event = exports.name_of_st = exports.name_of_et = exports.name_of_sel_rt = exports.name_of_unit = exports.name_of_linear = exports.name_of_sdr_rt = exports.SensorUnitTypeCodes = exports.Linearization = exports.SdrRecordType = exports.EventType = exports.ipmi = void 0;
    const index_1 = require("./index");
    const event_data_field = {
        // table 29-6 event data field
        'threshold': {
            b76: [
                'unspecified byte 2',
                'trigger reading in byte 2',
                'OEM code in byte 2',
                'sensor-specific event extension code in byte 2',
            ],
            b54: [
                'unspecified byte 3',
                'trigger threshold value in byte 3',
                'OEM code in byte 3',
                'sensor-specific event extension code in byte 3',
            ]
        },
        'discrete': {
            b76: [
                'unspecified byte 2',
                'previous state and/or severity in byte 2',
                'OEM code in byte 2',
                'sensor-specific event extension code in byte 2',
            ],
            b54: [
                'unspecified byte 3',
                'reserved',
                'OEM code in byte 3',
                'sensor-specific event extension code in byte 3',
            ]
        },
        'OEM': {
            b76: [
                'unspecified byte 2',
                'previous state and/or severity in byte 2',
                'OEM code in byte 2',
                'reserved',
            ],
            b54: [
                'unspecified byte 3',
                'reserved',
                'OEM code in byte 3',
                'reserved',
            ]
        }
    };
    const generic_event_type_codes = [
        {
            'unspecified': []
        },
        {
            'Threshold': [
                'Lower Non-critical - going low',
                'Lower Non-critical - going high',
                'Lower Critical - going low',
                'Lower Critical - going high',
                'Lower Non-recoverable - going low',
                'Lower Non-recoverable - going high',
                'Upper Non-critical - going low',
                'Upper Non-critical - going high',
                'Upper Critical - going low',
                'Upper Critical - going high',
                'Upper Non-recoverable - going low',
                'Upper Non-recoverable - going high',
            ],
        },
        {
            'DMI-based Usage State': [
                'Transition to Idle',
                'Transition to Active',
                'Transition to Busy',
            ]
        },
        {
            'digital Discrete': [
                'State Deasserted',
                'State Asserted',
            ]
        },
        {
            'digital Discrete': [
                'Predictive Failure deasserted',
                'Predictive Failure asserted',
            ]
        },
        {
            'digital Discrete': [
                'Limit Not Exceeded',
                'Limit Exceeded',
            ]
        },
        {
            'digital Discrete': [
                'Performance Met',
                'Performance Lags',
            ]
        },
        {
            'severity': [
                'transition to OK',
                'transition to Non-Critical from OK',
                'transition to Critical from less severe',
                'transition to Non-recoverable from less severe',
                'transition to Non-Critical from more severe',
                'transition to Critical from Non-recoverable',
                'transition to Non-recoverable',
                'Monitor',
                'Informational',
            ]
        },
        {
            'availability': [
                'Device Removed / Device Absent',
                'Device Inserted / Device Present',
            ]
        },
        {
            'availability': [
                'Device Disabled',
                'Device Enabled',
            ]
        },
        {
            'availability': [
                'transition to Running',
                'transition to In Test',
                'transition to Power Off',
                'transition to On Line',
                'transition to Off Line',
                'transition to Off Duty',
                'transition to Degraded',
                'transition to Power Save',
                'Install Error',
            ]
        },
        {
            'redundancy': [
                'Fully Redundant',
                'Redundancy Lost',
                'Redundancy Degraded',
                'Non-redundant:Sufficient Resources from Redundant',
                'Non-redundant:Sufficient Resources from Insufficient Resources',
                'Non-redundant:Insufficient Resources',
                'Redundancy Degraded from Fully Redundant',
                'Redundancy Degraded from Non-redundant',
            ]
        },
        {
            'ACPI Device Power': [
                'D0 Power State',
                'D1 Power State',
                'D2 Power State',
                'D3 Power State',
            ]
        },
    ];
    const sensor_type_codes = [
        {
            'reserved': []
        },
        {
            'Temperature': []
        },
        {
            'Voltage': []
        },
        {
            'Current': []
        },
        {
            'Fan': []
        },
        {
            'Physical Security': [
                'General Chassis Intrusion',
                'Drive Bay intrusion',
                'I/O Card area intrusion',
                'Processor area intrusion',
                'LAN Leash Lost',
                'Unauthorized dock',
                'FAN area intrusion',
            ]
        },
        {
            'Platform Security Violation Attempt': [
                'Secure Mode (Front Panel Lockout) Violation attempt',
                'Pre-boot Password Violation - user password',
                'Pre-boot Password Violation attempt - setup password',
                'Pre-boot Password Violation - network boot password',
                'Other pre-boot Password Violation',
                'Out-of-band Access Password Violation',
            ]
        },
        {
            'Processor': [
                'IERR',
                'Thermal Trip',
                'FRB1/BIST failure',
                'FRB2/Hang in POST failure',
                'FRB3/Processor Startup/Initialization failure',
                'Configuration Error',
                'SM BIOS Uncorrectable CPU-complex Error',
                'Processor Presence detected',
                'Processor disabled',
                'Terminator Presence Detected',
                'Processor Automatically Throttled',
                'Machine Check Exception (Uncorrectable)',
                'Correctable Machine Check Error',
            ]
        },
        {
            'Power Supply': [
                'Presence detected',
                'Power Supply Failure detected',
                'Predictive Failure',
                'Power Supply input lost (AC/DC)',
                'Power Supply input lost or out-of-range',
                'Power Supply input out-of-range, but present',
                'Configuration error',
                'Power Supply Inactive (in standby state)',
            ]
        },
        {
            'Power Unit': [
                'Power Off / Power Down',
                'Power Cycle',
                '240VA Power Down',
                'Interlock Power Down',
                'AC lost / Power input lost (The power source for the power unit was lost)',
                'Soft Power Control Failure (unit did not respond to request to turn on)',
                'Power Unit Failure detected',
                'Predictive Failure',
            ]
        },
        {
            'Cooling Device': []
        },
        {
            'Other Units-based Sensor': []
        },
        {
            'Memory': [
                'Correctable ECC / other correctable memory error',
                'Uncorrectable ECC / other uncorrectable memory error',
                'Parity',
                'Memory Scrub Failed (stuck bit)',
                'Memory Device Disabled',
                'Correctable ECC / other correctable memory error logging limit reached',
                'Presence detected',
                'Configuration error',
                'Spare',
                'Memory Automatically Throttled',
                'Critical Overtemperature',
            ]
        },
        {
            'Drive Slot (Bay)': [
                'Drive Presence',
                'Drive Fault',
                'Predictive Failure',
                'Hot Spare',
                'Consistency Check / Parity Check in progress',
                'In Critical Array',
                'In Failed Array',
                'Rebuild/Remap in progress',
                'Rebuild/Remap Aborted (was not completed normally)',
            ]
        },
        {
            'POST Memory Resize': []
        },
        {
            'System Firmware Progress': [
                'System Firmware Error (POST Error)',
                'System Firmware Hang',
                'System Firmware Progress',
            ]
        },
        {
            'Event Logging Disabled': [
                'Correctable Memory Error Logging Disabled',
                'Event `Type` Logging Disabled.',
                'Log Area Reset/Cleared',
                'All Event Logging Disabled',
                'SEL Full',
                'SEL Almost Full',
                'Correctable Machine Check Error Logging Disabled',
            ]
        },
        {
            'Watchdog 1': [
                'BIOS Watchdog Reset',
                'OS Watchdog Reset',
                'OS Watchdog Shut Down',
                'OS Watchdog Power Down',
                'OS Watchdog Power Cycle',
                'OS Watchdog NMI / Diagnostic Interrupt',
                'OS Watchdog Expired, status only',
                'OS Watchdog pre-timeout Interrupt, non-NMI',
            ]
        },
        {
            'System Event': [
                'System Reconfigured',
                'OEM System Boot Event',
                'Undetermined system hardware failure',
                'Entry added to Auxiliary Log',
                'PEF Action',
                'Timestamp Clock Synch.',
            ]
        },
        {
            'Critical Interrupt': [
                'Front Panel NMI / Diagnostic Interrupt',
                'Bus Timeout',
                'I/O channel check NMI',
                'Software NMI',
                'PCI PERR',
                'PCI SERR',
                'EISA Fail Safe Timeout',
                'Bus Correctable Error',
                'Bus Uncorrectable Error',
                'Fatal NMI (port 61h, bit 7)',
                'Bus Fatal Error',
                'Bus Degraded',
            ]
        },
        {
            'Button / Switch': [
                'Power Button pressed',
                'Sleep Button pressed',
                'Reset Button pressed',
                'FRU latch open',
                'FRU service request button',
            ]
        },
        {
            'Module / Board': []
        },
        {
            'Microcontroller / Coprocessor': []
        },
        {
            'Add-in Card': []
        },
        {
            'Chassis': []
        },
        {
            'Chip Set': [
                'Soft Power Control Failure',
                'Thermal Trip',
            ]
        },
        {
            'Other FRU': []
        },
        {
            'Cable / Interconnect': [
                'Cable/Interconnect is connected',
                'Configuration Error',
            ]
        },
        {
            'Terminator': []
        },
        {
            'System Boot / Restart Initiated': [
                'Initiated by power up',
                'Initiated by hard reset (this would typically be generated by',
                'Initiated by warm reset (this would typically be generated by',
                'User requested PXE boot',
                'Automatic boot to diagnostic',
                'OS / run-time software initiated hard reset',
                'OS / run-time software initiated warm reset',
                'System Restart',
            ]
        },
        {
            'Boot Error': [
                'No bootable media',
                'Non-bootable diskette left in drive',
                'PXE Server not found',
                'Invalid boot sector',
                'Timeout waiting for user selection of boot source',
            ]
        },
        {
            'Base OS Boot / Installation Status': [
                'A: boot completed',
                'C: boot completed',
                'PXE boot completed',
                'Diagnostic boot completed',
                'CD-ROM boot completed',
                'ROM boot completed',
                'boot completed - boot device not specified',
                'Base OS/Hypervisor Installation started ',
                'Base OS/Hypervisor Installation completed',
                'Base OS/Hypervisor Installation aborted',
                'Base OS/Hypervisor Installation failed',
            ]
        },
        {
            'OS Stop / Shutdown': [
                'Critical stop during OS load / initialization',
                'Run-time Critical Stop (a.k.a. `core dump`, `blue screen`)',
                'OS Graceful Stop',
                'OS Graceful Shutdown',
                'Soft Shutdown initiated by PEF',
                'Agent Not Responding',
            ]
        },
        {
            'Slot / Connector': [
                'Fault Status asserted',
                'Identify Status asserted',
                'Slot / Connector Device installed/attached',
                'Slot / Connector Ready for Device Installation',
                'Slot/Connector Ready for Device Removal',
                'Slot Power is Off',
                'Slot / Connector Device Removal Request',
                'Interlock asserted',
                'Slot is Disabled',
                'Slot holds spare device',
            ]
        },
        {
            'System ACPI Power State': [
                'S0 / G0 working',
                'S1 sleeping with system h/w & processor context maintained',
                'S2 sleeping, processor context lost',
                'S3 sleeping, processor & h/w context lost, memory retained',
                'S4 non-volatile sleep / suspend-to disk',
                'S5 / G2 soft-off',
                'S4 / S5 soft-off, particular S4 / S5 state cannot be determined',
                'G3 / Mechanical Off',
                'Sleeping in an S1, S2, or S3 states',
                'G1 sleeping',
                'S5 entered by override',
                'Legacy ON state',
                'Legacy OFF state',
                'unspecified',
                'Unknown',
            ]
        },
        {
            'Watchdog 2': [
                'Timer expired, status only',
                'Hard Reset',
                'Power Down',
                'Power Cycle',
                'reserved',
                'reserved',
                'reserved',
                'reserved',
                'Timer interrupt',
            ]
        },
        {
            'Platform Alert': [
                'platform generated page',
                'platform generated LAN alert',
                'Platform Event Trap generated',
                'platform generated SNMP trap, OEM format',
            ]
        },
        {
            'Entity Presence': [
                'Entity Present',
                'Entity Absent',
                'Entity Disabled',
            ]
        },
        {
            'Monitor ASIC / IC': []
        },
        {
            'LAN': [
                'LAN Heartbeat Lost',
                'LAN Heartbeat',
            ]
        },
        {
            'Management Subsystem Health': [
                'sensor access degraded or unavailable',
                'controller access degraded or unavailable',
                'management controller off-line',
                'management controller unavailable',
                'Sensor failure',
                'FRU failure',
            ]
        },
        {
            'Battery': [
                'battery low (predictive failure)',
                'battery failed',
                'battery presence detected',
            ]
        },
        {
            'Session Audit': [
                'Session Activated',
                'Session Deactivated',
                'Invalid Username or Password',
                'Invalid password disable',
            ]
        },
        {
            'Version Change': [
                'Hardware change detected with associated Entity',
                'Firmware or software change detected with associated Entity',
                'Hardware incompatibility detected with associated Entity',
                'Firmware or software incompatibility detected with associated Entity',
                'Entity is of an invalid or unsupported hardware version',
                'Entity contains an invalid or unsupported firmware or software version',
                'Hardware Change detected with associated Entity was successful',
                'Software or F/W Change detected with associated Entity was successful',
            ]
        },
        {
            'FRU State': [
                'FRU Not Installed',
                'FRU Inactive (in standby or `hot spare` state)',
                'FRU Activation Requested',
                'FRU Activation In Progress',
                'FRU Active',
                'FRU Deactivation Requested',
                'FRU Deactivation In Progress',
                'FRU Communication Lost',
            ]
        },
    ];
    const event_data = {
        0x05: {
            // Physical Security
            0x04: (selr) => {
                // LAN Leash Lost
                return { d2: `network controller #${selr.event_data2}` };
            }
        },
        0x08: {
            // Power Supply
            0x06: (selr) => {
                // Configuration error
                const error_types = [
                    "Vendor mismatch",
                    "Revision mismatch",
                    "Processor missing",
                    "Power Supply rating mismatch",
                    "Voltage rating mismatch",
                ];
                return { d3: error_types.indexOfOr(selr.event_data3 & 0xf, 'reserved') };
            }
        },
        0x0c: {
            // Memory
            0x00: (selr) => {
                // 0~8h
                return { d3: `Memory #${selr.event_data3}` };
            }
        },
        0x0f: {
            // System Firmware Progress
            0x00: (selr) => {
                // System Firmware Error
                const error_types = [
                    "Unspecified",
                    "No system memory is physically installed in the system",
                    "No usable system memory",
                    "Unrecoverable hard-disk/ATAPI/IDE device failure",
                    "Unrecoverable system-board failure",
                    "Unrecoverable diskette subsystem failure",
                    "Unrecoverable hard-disk controller failure",
                    "Unrecoverable PS/2 or USB keyboard failure",
                    "Removable boot media not found",
                    "Unrecoverable video controller failure",
                    "No video device detected",
                    "Firmware (BIOS) ROM corruption detected",
                    "CPU voltage mismatch (processors that share same supply",
                    "CPU speed matching failure"
                ];
                return { d2: error_types.indexOfOr(selr.event_data2, 'reserved') };
            },
            // System Firmware Hang
            // 0x01: same as event_data[0x0f][0x00], will set later
            0x02: (selr) => {
                // System Firmware Progress
                const error_types = [
                    "Unspecified",
                    "Memory initialization",
                    "Hard-disk initialization",
                    "Secondary processor(s) initialization",
                    "User authentication",
                    "User-initiated system setup",
                    "USB resource configuration",
                    "PCI resource configuration",
                    "Option ROM initialization",
                    "Video initialization",
                    "Cache initialization",
                    "SM Bus initialization",
                    "Keyboard controller initialization",
                    "Embedded controller/management controller initialization",
                    "Docking station attachment",
                    "Enabling docking station",
                    "Docking station ejection",
                    "Disabling docking station",
                    "Calling operating system wake-up vector",
                    "Starting operating system boot process, e.g. calling Int 19h",
                    "Baseboard or motherboard initialization",
                    "reserved",
                    "Floppy initialization",
                    "Keyboard test",
                    "Pointing device test",
                    "Primary processor initialization",
                ];
                return { d2: error_types.indexOfOr(selr.event_data2, 'reserved') };
            },
        },
        0x10: {
            // Event Logging Disabled
            0x00: (selr) => {
                // Correctable Memory Error Logging Disabled
                return { d2: `Memory #${selr.event_data2}` };
            },
            0x01: (selr) => {
                // Event Type Logging Disabled
                const et = name_of_et(selr.event_data2);
                let s;
                if ((selr.event_data3 >> 5) == 1) {
                    s = 'logging has been disabled for all events of given type';
                }
                else {
                    const dir = (selr.event_data3 >> 4) == 1 ? 'assert' : 'deassert';
                    const os = p_event(selr.event_data2, selr.event_data3 & 0xf, 0xff);
                    s = `logging is disabled for ${dir}: ${os}`;
                }
                return { d2: et, d3: s };
            },
            0x05: (selr) => {
                // SEL Almost Full
                return { d3: `${selr.event_data3}% full` };
            },
            0x06: (selr) => {
                // Correctable Machine Check Error Logging Disabled
                const x = (selr.event_data3 >> 7) & 1;
                const d3 = x == 0 ? 'Entity Instance number' : 'Vendor-specific processor number';
                return { d2: `#${selr.event_data2}`, d3: d3 };
            },
        },
        0x12: {
            // System Event
            0x03: (selr) => {
                // Entry added to Auxiliary log
                const actions = [
                    "entry added",
                    "entry added because event did not be map to standard IPMI event",
                    "entry added along with one or more corresponding SEL entries",
                    "log cleared",
                    "log disabled",
                    "log enabled",
                ];
                const types = [
                    "MCA Log",
                    "OEM 1",
                    "OEM 2",
                ];
                const a = actions.indexOfOr((selr.event_data2 >> 4) & 0xf, 'reserved');
                const t = types.indexOfOr(selr.event_data2 & 0xf, 'reserved');
                return { d2: `${t}, ${a}` };
            },
            0x04: (selr) => {
                // PEF Action
                const actions = [
                    "Alert",
                    "power off",
                    "reset",
                    "power cycle",
                    "OEM action",
                    "Diagnostic Interrupt (NMI)",
                ];
                const a = actions.bitsOr(selr.event_data2, 'reserved');
                return { d2: a.join(', ') };
            },
            0x05: (selr) => {
                // Timestamp Clock Synch.
                const p = (selr.event_data2 >> 7) == 0 ? 'first of pair' : 'second of pair';
                const t = (selr.event_data2 & 0xf) == 0 ? 'SEL Timestamp Clock updated' : 'SDR Timestamp Clock updated';
                return { d2: `${t}, ${p}` };
            }
        },
        0x19: {
            // Chip Set
            0x00: (selr) => {
                // Soft Power Control Failure
                const types = [
                    "S0 / G0 working",
                    "S1 sleeping with system h/w & processor context maintained",
                    "S2 sleeping, processor context lost",
                    "S3 sleeping, processor & h/w context lost, memory retained",
                    "S4 non-volatile sleep / suspend-to disk",
                    "S5 / G2 soft-off",
                    "S4 / S5 soft-off, particular S4 / S5 state cannot be determined",
                    "G3 / Mechanical Off",
                    "Sleeping in an S1, S2, or S3 states",
                    "G1 sleeping (S1-S4 state cannot be determined)",
                    "S5 entered by override",
                    "Legacy ON state",
                    "Legacy OFF state",
                ];
                const r = types.indexOfOr(selr.event_data2, "reserved");
                const c = types.indexOfOr(selr.event_data3, "reserved");
                return { d2: `Requested power state: ${r}`, d3: `Power state at time of request: ${c}` };
            }
        },
        0x1d: {
            // system boot
            0x07: (selr) => {
                // system restart
                const causes = [
                    "unknown",
                    "Chassis Control command",
                    "reset via pushbutton",
                    "power-up via power pushbutton",
                    "Watchdog expiration",
                    "OEM",
                    "automatic power-up on AC being applied due to 'always restore' power restore policy",
                    "automatic power-up on AC being applied due to 'restore previous power state' power restore policy",
                    "reset via PEF",
                    "power-cycle via PEF",
                    "soft reset (e.g. CTRL-ALT-DEL)",
                    "power-up via RTC",
                ];
                return { d2: causes.indexOfOr(selr.event_data2, 'reserved'), d3: `from channel ${selr.event_data3}` };
            }
        },
        0x21: {
            // slot/connector
            0x00: (selr) => {
                // 0~9h
                const types = [
                    "PCI",
                    "Drive Array",
                    "External Peripheral Connector",
                    "Docking",
                    "other standard internal expansion slot",
                    "slot associated with entity specified by Entity ID for sensor",
                    "AdvancedTCA",
                    "DIMM/memory device",
                    "FAN",
                    "PCI Express",
                    "SCSI (parallel)",
                    "SATA / SAS"
                ];
                return { d2: types.indexOfOr(selr.event_data2 & 0x7f, 'reserved'), d3: `Slot/Connector #${selr.event_data3}` };
            }
        },
        0x23: {
            // watchdog 2
            0x00: (selr) => {
                // 0~3, 8h
                const types = [
                    "none",
                    "SMI",
                    "NMI",
                    "Messaging Interrupt",
                ];
                const uses = [
                    "reserved",
                    "BIOS FRB2",
                    "BIOS/POST",
                    "OS Load",
                    "SMS/OS",
                    "OEM",
                ];
                return {
                    d2: `interrupt type ${types.indexOfOr((selr.event_data2 >> 4) & 0xf, 'unspecified')}`,
                    d3: `timer use ${types.indexOfOr(selr.event_data2 & 0xf, 'unspecified')}`
                };
            }
        },
        0x28: {
            // management subsystem health
            0x04: (selr) => {
                // sensor failure
                return { d2: `sensor number ${selr.event_data2.toHexh()}` };
            },
            0x05: (selr) => {
                // FRU failure
                const ed2 = selr.event_data2;
                const isLogic = ((ed2 >> 7) & 1) == 1;
                const d2 = `device is ${isLogic ? '' : 'not'} a logical FRU Device: LUN ${(ed2 >> 3) & 0x3}, bus ID ${ed2 & 3}`;
                let d3;
                if (isLogic) {
                    d3 = 'FRU Device ID:';
                }
                else {
                    d3 = '7-bit I2C Slave Address of FRU device';
                }
                d3 += `: ${selr.event_data3.toHexh()}h`;
                return { d2: d2, d3: d3 };
            },
        },
        0x2a: {
            // session audit
            0x03: (selr) => {
                // invalid password disable
                const user = selr.event_data2 & 0x3f;
                const causes = [
                    "Session deactivatation cause unspecified",
                    "Session deactivated by Close Session command",
                    "Session deactivated by timeout",
                    "Session deactivated by configuration change",
                ];
                const cause = causes.indexOfOr((selr.event_data3 >> 4) & 3, 'reserved');
                const ch = selr.event_data3 & 0xf;
                return { d2: `user ID: ${user}`, d3: `${cause}, channel #${ch}` };
            }
        },
        0x2b: {
            // version change
            0x07: (selr) => {
                // software or F/W chagne detected
                const types = [
                    "unspecified",
                    "management controller device ID (change in one or more fields from ‘Get Device ID’)",
                    "management controller firmware revision",
                    "management controller device revision",
                    "management controller manufacturer ID",
                    "management controller IPMI version",
                    "management controller auxiliary firmware ID",
                    "management controller firmware boot block",
                    "other management controller firmware",
                    "system firmware (EFI / BIOS) change",
                    "SMBIOS change",
                    "operating system change",
                    "operating system loader change",
                    "service or diagnostic partition change",
                    "management software agent change",
                    "management software application change",
                    "management software middleware change",
                    "programmable hardware change (e.g. FPGA)",
                    "board/FRU module change (change of a module plugged into associated entity)",
                    "board/FRU component change (addition or removal of a replaceable component on the board/FRU that is not tracked as a FRU)",
                    "board/FRU replaced with equivalent version",
                    "board/FRU replaced with newer version",
                    "board/FRU replaced with older version",
                    "board/FRU hardware configuration change (e.g. strap, jumper, cable change, etc.)",
                ];
                return { d2: types.indexOfOr(selr.event_data2, 'reserved') };
            }
        }
    };
    // memory offset 0~8h
    for (let i = 1; i <= 8; i++) {
        event_data[0x0c][i] = event_data[0x0c][0x00];
    }
    // System Firmware Hang
    event_data[0x0f][0x01] = event_data[0x0f][0x00];
    // slot/connector offset 0~9h
    for (let i = 1; i <= 9; i++) {
        event_data[0x21][i] = event_data[0x21][0x00];
    }
    // watchdog 2 offset 0~3, 8h
    for (let i = 1; i <= 3; i++) {
        event_data[0x23][i] = event_data[0x23][0x00];
    }
    event_data[0x23][8] = event_data[0x23][0x00];
    const ipmi = {
        event_data_field,
        generic_event_type_codes,
        sensor_type_codes,
        event_data,
    };
    exports.ipmi = ipmi;
    var EventType;
    (function (EventType) {
        EventType[EventType["threshold"] = 1] = "threshold";
        EventType[EventType["sensor_specific"] = 111] = "sensor_specific";
    })(EventType || (EventType = {}));
    exports.EventType = EventType;
    var SdrRecordType;
    (function (SdrRecordType) {
        SdrRecordType[SdrRecordType["Full"] = 1] = "Full";
        SdrRecordType[SdrRecordType["Compact"] = 2] = "Compact";
        SdrRecordType[SdrRecordType["EventOnly"] = 3] = "EventOnly";
        SdrRecordType[SdrRecordType["FruDeviceLocator"] = 17] = "FruDeviceLocator";
        SdrRecordType[SdrRecordType["ManagementControllerDeviceLocator"] = 18] = "ManagementControllerDeviceLocator";
        SdrRecordType[SdrRecordType["OEM"] = 192] = "OEM";
    })(SdrRecordType || (SdrRecordType = {}));
    exports.SdrRecordType = SdrRecordType;
    var Linearization;
    (function (Linearization) {
        Linearization[Linearization["linear"] = 0] = "linear";
        Linearization[Linearization["ln"] = 1] = "ln";
        Linearization[Linearization["log10"] = 2] = "log10";
        Linearization[Linearization["log2"] = 3] = "log2";
        Linearization[Linearization["e"] = 4] = "e";
        Linearization[Linearization["exp10"] = 5] = "exp10";
        Linearization[Linearization["exp2"] = 6] = "exp2";
        Linearization[Linearization["reciprocal"] = 7] = "reciprocal";
        Linearization[Linearization["sqr"] = 8] = "sqr";
        Linearization[Linearization["cube"] = 9] = "cube";
        Linearization[Linearization["sqrt"] = 10] = "sqrt";
        Linearization[Linearization["cubeByNegOne"] = 11] = "cubeByNegOne";
    })(Linearization || (Linearization = {}));
    exports.Linearization = Linearization;
    var SensorUnitTypeCodes;
    (function (SensorUnitTypeCodes) {
        SensorUnitTypeCodes[SensorUnitTypeCodes["unspecified"] = 0] = "unspecified";
        SensorUnitTypeCodes[SensorUnitTypeCodes["degrees C"] = 1] = "degrees C";
        SensorUnitTypeCodes[SensorUnitTypeCodes["degrees F"] = 2] = "degrees F";
        SensorUnitTypeCodes[SensorUnitTypeCodes["degrees K"] = 3] = "degrees K";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Volts"] = 4] = "Volts";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Amps"] = 5] = "Amps";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Watts"] = 6] = "Watts";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Joules"] = 7] = "Joules";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Coulombs"] = 8] = "Coulombs";
        SensorUnitTypeCodes[SensorUnitTypeCodes["VA"] = 9] = "VA";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Nits"] = 10] = "Nits";
        SensorUnitTypeCodes[SensorUnitTypeCodes["lumen"] = 11] = "lumen";
        SensorUnitTypeCodes[SensorUnitTypeCodes["lux"] = 12] = "lux";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Candela"] = 13] = "Candela";
        SensorUnitTypeCodes[SensorUnitTypeCodes["kPa"] = 14] = "kPa";
        SensorUnitTypeCodes[SensorUnitTypeCodes["PSI"] = 15] = "PSI";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Newton"] = 16] = "Newton";
        SensorUnitTypeCodes[SensorUnitTypeCodes["CFM"] = 17] = "CFM";
        SensorUnitTypeCodes[SensorUnitTypeCodes["RPM"] = 18] = "RPM";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Hz"] = 19] = "Hz";
        SensorUnitTypeCodes[SensorUnitTypeCodes["microsecond"] = 20] = "microsecond";
        SensorUnitTypeCodes[SensorUnitTypeCodes["millisecond"] = 21] = "millisecond";
        SensorUnitTypeCodes[SensorUnitTypeCodes["second"] = 22] = "second";
        SensorUnitTypeCodes[SensorUnitTypeCodes["minute"] = 23] = "minute";
        SensorUnitTypeCodes[SensorUnitTypeCodes["hour"] = 24] = "hour";
        SensorUnitTypeCodes[SensorUnitTypeCodes["day"] = 25] = "day";
        SensorUnitTypeCodes[SensorUnitTypeCodes["week"] = 26] = "week";
        SensorUnitTypeCodes[SensorUnitTypeCodes["mil"] = 27] = "mil";
        SensorUnitTypeCodes[SensorUnitTypeCodes["inches"] = 28] = "inches";
        SensorUnitTypeCodes[SensorUnitTypeCodes["feet"] = 29] = "feet";
        SensorUnitTypeCodes[SensorUnitTypeCodes["cu in"] = 30] = "cu in";
        SensorUnitTypeCodes[SensorUnitTypeCodes["cu feet"] = 31] = "cu feet";
        SensorUnitTypeCodes[SensorUnitTypeCodes["mm"] = 32] = "mm";
        SensorUnitTypeCodes[SensorUnitTypeCodes["cm"] = 33] = "cm";
        SensorUnitTypeCodes[SensorUnitTypeCodes["m"] = 34] = "m";
        SensorUnitTypeCodes[SensorUnitTypeCodes["cu cm"] = 35] = "cu cm";
        SensorUnitTypeCodes[SensorUnitTypeCodes["cu m"] = 36] = "cu m";
        SensorUnitTypeCodes[SensorUnitTypeCodes["liters"] = 37] = "liters";
        SensorUnitTypeCodes[SensorUnitTypeCodes["fluid ounce"] = 38] = "fluid ounce";
        SensorUnitTypeCodes[SensorUnitTypeCodes["radians"] = 39] = "radians";
        SensorUnitTypeCodes[SensorUnitTypeCodes["steradians"] = 40] = "steradians";
        SensorUnitTypeCodes[SensorUnitTypeCodes["revolutions"] = 41] = "revolutions";
        SensorUnitTypeCodes[SensorUnitTypeCodes["cycles"] = 42] = "cycles";
        SensorUnitTypeCodes[SensorUnitTypeCodes["gravities"] = 43] = "gravities";
        SensorUnitTypeCodes[SensorUnitTypeCodes["ounce"] = 44] = "ounce";
        SensorUnitTypeCodes[SensorUnitTypeCodes["pound"] = 45] = "pound";
        SensorUnitTypeCodes[SensorUnitTypeCodes["ft-lb"] = 46] = "ft-lb";
        SensorUnitTypeCodes[SensorUnitTypeCodes["oz-in"] = 47] = "oz-in";
        SensorUnitTypeCodes[SensorUnitTypeCodes["gauss"] = 48] = "gauss";
        SensorUnitTypeCodes[SensorUnitTypeCodes["gilberts"] = 49] = "gilberts";
        SensorUnitTypeCodes[SensorUnitTypeCodes["henry"] = 50] = "henry";
        SensorUnitTypeCodes[SensorUnitTypeCodes["millihenry"] = 51] = "millihenry";
        SensorUnitTypeCodes[SensorUnitTypeCodes["farad"] = 52] = "farad";
        SensorUnitTypeCodes[SensorUnitTypeCodes["microfarad"] = 53] = "microfarad";
        SensorUnitTypeCodes[SensorUnitTypeCodes["ohms"] = 54] = "ohms";
        SensorUnitTypeCodes[SensorUnitTypeCodes["siemens"] = 55] = "siemens";
        SensorUnitTypeCodes[SensorUnitTypeCodes["mole"] = 56] = "mole";
        SensorUnitTypeCodes[SensorUnitTypeCodes["becquerel"] = 57] = "becquerel";
        SensorUnitTypeCodes[SensorUnitTypeCodes["PPM"] = 58] = "PPM";
        SensorUnitTypeCodes[SensorUnitTypeCodes["reserved"] = 59] = "reserved";
        SensorUnitTypeCodes[SensorUnitTypeCodes["Decibels"] = 60] = "Decibels";
        SensorUnitTypeCodes[SensorUnitTypeCodes["DbA"] = 61] = "DbA";
        SensorUnitTypeCodes[SensorUnitTypeCodes["DbC"] = 62] = "DbC";
        SensorUnitTypeCodes[SensorUnitTypeCodes["gray"] = 63] = "gray";
        SensorUnitTypeCodes[SensorUnitTypeCodes["sievert"] = 64] = "sievert";
        SensorUnitTypeCodes[SensorUnitTypeCodes["color temp deg K"] = 65] = "color temp deg K";
        SensorUnitTypeCodes[SensorUnitTypeCodes["bit"] = 66] = "bit";
        SensorUnitTypeCodes[SensorUnitTypeCodes["kilobit"] = 67] = "kilobit";
        SensorUnitTypeCodes[SensorUnitTypeCodes["megabit"] = 68] = "megabit";
        SensorUnitTypeCodes[SensorUnitTypeCodes["gigabit"] = 69] = "gigabit";
        SensorUnitTypeCodes[SensorUnitTypeCodes["byte"] = 70] = "byte";
        SensorUnitTypeCodes[SensorUnitTypeCodes["kilobyte"] = 71] = "kilobyte";
        SensorUnitTypeCodes[SensorUnitTypeCodes["megabyte"] = 72] = "megabyte";
        SensorUnitTypeCodes[SensorUnitTypeCodes["gigabyte"] = 73] = "gigabyte";
        SensorUnitTypeCodes[SensorUnitTypeCodes["word"] = 74] = "word";
        SensorUnitTypeCodes[SensorUnitTypeCodes["dword"] = 75] = "dword";
        SensorUnitTypeCodes[SensorUnitTypeCodes["qword"] = 76] = "qword";
        SensorUnitTypeCodes[SensorUnitTypeCodes["line"] = 77] = "line";
        SensorUnitTypeCodes[SensorUnitTypeCodes["hit"] = 78] = "hit";
        SensorUnitTypeCodes[SensorUnitTypeCodes["miss"] = 79] = "miss";
        SensorUnitTypeCodes[SensorUnitTypeCodes["retry"] = 80] = "retry";
        SensorUnitTypeCodes[SensorUnitTypeCodes["reset"] = 81] = "reset";
        SensorUnitTypeCodes[SensorUnitTypeCodes["overrun / overflow"] = 82] = "overrun / overflow";
        SensorUnitTypeCodes[SensorUnitTypeCodes["underrun"] = 83] = "underrun";
        SensorUnitTypeCodes[SensorUnitTypeCodes["collision"] = 84] = "collision";
        SensorUnitTypeCodes[SensorUnitTypeCodes["packets"] = 85] = "packets";
        SensorUnitTypeCodes[SensorUnitTypeCodes["messages"] = 86] = "messages";
        SensorUnitTypeCodes[SensorUnitTypeCodes["characters"] = 87] = "characters";
        SensorUnitTypeCodes[SensorUnitTypeCodes["error"] = 88] = "error";
        SensorUnitTypeCodes[SensorUnitTypeCodes["correctable error"] = 89] = "correctable error";
        SensorUnitTypeCodes[SensorUnitTypeCodes["uncorrectable error"] = 90] = "uncorrectable error";
        SensorUnitTypeCodes[SensorUnitTypeCodes["fatal error"] = 91] = "fatal error";
        SensorUnitTypeCodes[SensorUnitTypeCodes["grams"] = 92] = "grams";
    })(SensorUnitTypeCodes || (SensorUnitTypeCodes = {}));
    exports.SensorUnitTypeCodes = SensorUnitTypeCodes;
    function name_of_sdr_rt(n) {
        return index_1.name_of(SdrRecordType, n);
    }
    exports.name_of_sdr_rt = name_of_sdr_rt;
    function name_of_linear(n) {
        return index_1.name_of(Linearization, n);
    }
    exports.name_of_linear = name_of_linear;
    function name_of_unit(n) {
        return index_1.name_of(SensorUnitTypeCodes, n);
    }
    exports.name_of_unit = name_of_unit;
    function name_of_sel_rt(n) {
        if (n == 2) {
            return 'system event';
        }
        if ((n >= 0xc0) && (n <= 0xdf)) {
            return 'OEM timestamped';
        }
        if ((n >= 0xe0) && (n <= 0xff)) {
            return 'OEM non-timestamped';
        }
        return 'unspecified';
    }
    exports.name_of_sel_rt = name_of_sel_rt;
    function name_of_et(n) {
        n = n & 0x7f;
        if (n == 0) {
            return 'unspecified';
        }
        if (n == 1) {
            return 'threshold';
        }
        if ((n >= 0x2) && (n <= 0xc)) {
            return Object.keys(ipmi.generic_event_type_codes[n])[0];
        }
        if (n == 0x6f) {
            return 'sensor-specific';
        }
        if ((n >= 0x70) && (n <= 0x7f)) {
            return 'OEM';
        }
        // 0dh-6eh
        return 'reserved';
    }
    exports.name_of_et = name_of_et;
    function name_of_st(n) {
        if (n < ipmi.sensor_type_codes.length) {
            return Object.keys(ipmi.sensor_type_codes[n])[0];
        }
        if ((n >= 0xc0) && (n <= 0xff)) {
            return 'OEM';
        }
        return 'reserved';
    }
    exports.name_of_st = name_of_st;
    function p_edf(et, n) {
        // table 29-6 event data field
        et = et & 0x7f;
        let k;
        if (et == 1) {
            k = 'threshold';
        }
        else if ((et >= 0x2) && (et <= 0xc)) {
            k = 'discrete';
        }
        else if (et == 0x6f) {
            k = 'discrete';
        }
        else {
            k = 'OEM';
        }
        const b76 = (n >> 6) & 0x3;
        const b54 = (n >> 4) & 0x3;
        // console.log('n ' + (n >> 4) + ', k ' + k + ', b76 ' + b76 + ', b54 ' + b54)
        return ipmi.event_data_field[k]['b76'][b76] + ', ' + ipmi.event_data_field[k]['b54'][b54];
    }
    exports.p_edf = p_edf;
    function p_event(n, offset, sensor_type) {
        n = n & 0x7f;
        offset = offset & 0xf;
        if (n == 0) {
            return "unspecified";
        }
        if ((n >= 0x1) && (n <= 0xc)) {
            return p_generic_event(n, offset);
        }
        if (n == 0x6f) {
            return p_sensor_event(sensor_type, offset);
        }
        if ((n >= 0x70) && (n <= 0x7f)) {
            return 'OEM';
        }
        else {
            // [0xd, 0x6e]
            return 'reserved';
        }
    }
    exports.p_event = p_event;
    function p_generic_event(n, offset) {
        const x = ipmi.generic_event_type_codes[n];
        const values = Object.values(x)[0];
        if (offset >= values.length) {
            return 'unspecified';
        }
        return values[offset];
    }
    function p_sensor_event(n, offset) {
        if (n == 0) {
            return 'reserved';
        }
        if ((n >= ipmi.sensor_type_codes.length) && (n <= 0xc0)) {
            return 'reserved';
        }
        if ((n >= 0xc0) && (n <= 0xff)) {
            return 'OEM';
        }
        // n in range: [01h, ipmi.sensor_type_codes.length)
        const x = ipmi.sensor_type_codes[n];
        const name = Object.keys(x)[0];
        const values = Object.values(x)[0];
        if ((n >= 1) && (n <= 4)) {
            return name;
        }
        // n in range: [05h, ipmi.sensor_type_codes.length)
        if (offset >= values.length) {
            return 'unspecified';
        }
        return values[offset];
    }
});
//# sourceMappingURL=ipmi.js.map