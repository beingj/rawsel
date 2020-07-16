import { name_of } from "./index"

const event_data_field: { [key: string]: { [key: string]: string[] } } = {
    // table 29-6 event data field
    threshold: {
        b76: [
            "unspecified byte 2",
            "trigger reading in byte 2",
            "OEM code in byte 2",
            "sensor-specific event extension code in byte 2"
        ],
        b54: [
            "unspecified byte 3",
            "trigger threshold value in byte 3",
            "OEM code in byte 3",
            "sensor-specific event extension code in byte 3"
        ]
    },
    discrete: {
        b76: [
            "unspecified byte 2",
            "previous state and/or severity in byte 2",
            "OEM code in byte 2",
            "sensor-specific event extension code in byte 2"
        ],
        b54: [
            "unspecified byte 3",
            "reserved",
            "OEM code in byte 3",
            "sensor-specific event extension code in byte 3"
        ]
    },
    OEM: {
        b76: [
            "unspecified byte 2",
            "previous state and/or severity in byte 2",
            "OEM code in byte 2",
            "reserved"
        ],
        b54: [
            "unspecified byte 3",
            "reserved",
            "OEM code in byte 3",
            "reserved"
        ]
    }
}

const generic_event_type_codes: Array<{ [key: string]: string[] }> = [
    {
        unspecified: []
    },
    {
        // 1
        Threshold: [
            "Lower Non-critical - going low",
            "Lower Non-critical - going high",
            "Lower Critical - going low",
            "Lower Critical - going high",
            "Lower Non-recoverable - going low",
            "Lower Non-recoverable - going high",
            "Upper Non-critical - going low",
            "Upper Non-critical - going high",
            "Upper Critical - going low",
            "Upper Critical - going high",
            "Upper Non-recoverable - going low",
            "Upper Non-recoverable - going high"
        ]
    },
    {
        // 2
        "DMI-based Usage State": [
            "Transition to Idle",
            "Transition to Active",
            "Transition to Busy"
        ]
    },
    {
        // 3
        "digital Discrete": ["State Deasserted", "State Asserted"]
    },
    {
        // 4
        "digital Discrete": [
            "Predictive Failure deasserted",
            "Predictive Failure asserted"
        ]
    },
    {
        // 5
        "digital Discrete": ["Limit Not Exceeded", "Limit Exceeded"]
    },
    {
        // 6
        "digital Discrete": ["Performance Met", "Performance Lags"]
    },
    {
        // 7
        severity: [
            "transition to OK",
            "transition to Non-Critical from OK",
            "transition to Critical from less severe",
            "transition to Non-recoverable from less severe",
            "transition to Non-Critical from more severe",
            "transition to Critical from Non-recoverable",
            "transition to Non-recoverable",
            "Monitor",
            "Informational"
        ]
    },
    {
        // 8
        availability: [
            "Device Removed / Device Absent",
            "Device Inserted / Device Present"
        ]
    },
    {
        // 9
        availability: ["Device Disabled", "Device Enabled"]
    },
    {
        // 10
        availability: [
            "transition to Running",
            "transition to In Test",
            "transition to Power Off",
            "transition to On Line",
            "transition to Off Line",
            "transition to Off Duty",
            "transition to Degraded",
            "transition to Power Save",
            "Install Error"
        ]
    },
    {
        // 11
        redundancy: [
            "Fully Redundant",
            "Redundancy Lost",
            "Redundancy Degraded",
            "Non-redundant:Sufficient Resources from Redundant",
            "Non-redundant:Sufficient Resources from Insufficient Resources",
            "Non-redundant:Insufficient Resources",
            "Redundancy Degraded from Fully Redundant",
            "Redundancy Degraded from Non-redundant"
        ]
    },
    {
        // 12
        "ACPI Device Power": [
            "D0 Power State",
            "D1 Power State",
            "D2 Power State",
            "D3 Power State"
        ]
    }
]

const sensor_type_codes: Array<{ [key: string]: string[] }> = [
    {
        // 0
        reserved: []
    },
    {
        // 1
        Temperature: []
    },
    {
        // 2
        Voltage: []
    },
    {
        // 3
        Current: []
    },
    {
        // 4
        Fan: []
    },
    {
        // 5
        "Physical Security": [
            "General Chassis Intrusion",
            "Drive Bay intrusion",
            "I/O Card area intrusion",
            "Processor area intrusion",
            "LAN Leash Lost",
            "Unauthorized dock",
            "FAN area intrusion"
        ]
    },
    {
        // 6
        "Platform Security Violation Attempt": [
            "Secure Mode (Front Panel Lockout) Violation attempt",
            "Pre-boot Password Violation - user password",
            "Pre-boot Password Violation attempt - setup password",
            "Pre-boot Password Violation - network boot password",
            "Other pre-boot Password Violation",
            "Out-of-band Access Password Violation"
        ]
    },
    {
        // 7
        Processor: [
            "IERR",
            "Thermal Trip",
            "FRB1/BIST failure",
            "FRB2/Hang in POST failure",
            "FRB3/Processor Startup/Initialization failure",
            "Configuration Error",
            "SM BIOS Uncorrectable CPU-complex Error",
            "Processor Presence detected",
            "Processor disabled",
            "Terminator Presence Detected",
            "Processor Automatically Throttled",
            "Machine Check Exception (Uncorrectable)",
            "Correctable Machine Check Error"
        ]
    },
    {
        // 8
        "Power Supply": [
            "Presence detected",
            "Power Supply Failure detected",
            "Predictive Failure",
            "Power Supply input lost (AC/DC)",
            "Power Supply input lost or out-of-range",
            "Power Supply input out-of-range, but present",
            "Configuration error",
            "Power Supply Inactive (in standby state)"
        ]
    },
    {
        // 9
        "Power Unit": [
            "Power Off / Power Down",
            "Power Cycle",
            "240VA Power Down",
            "Interlock Power Down",
            "AC lost / Power input lost (The power source for the power unit was lost)",
            "Soft Power Control Failure (unit did not respond to request to turn on)",
            "Power Unit Failure detected",
            "Predictive Failure"
        ]
    },
    {
        // a
        "Cooling Device": []
    },
    {
        // b
        "Other Units-based Sensor": []
    },
    {
        // c
        Memory: [
            "Correctable ECC / other correctable memory error",
            "Uncorrectable ECC / other uncorrectable memory error",
            "Parity",
            "Memory Scrub Failed (stuck bit)",
            "Memory Device Disabled",
            "Correctable ECC / other correctable memory error logging limit reached",
            "Presence detected",
            "Configuration error",
            "Spare",
            "Memory Automatically Throttled",
            "Critical Overtemperature"
        ]
    },
    {
        // d
        "Drive Slot (Bay)": [
            "Drive Presence",
            "Drive Fault",
            "Predictive Failure",
            "Hot Spare",
            "Consistency Check / Parity Check in progress",
            "In Critical Array",
            "In Failed Array",
            "Rebuild/Remap in progress",
            "Rebuild/Remap Aborted (was not completed normally)"
        ]
    },
    {
        // e
        "POST Memory Resize": []
    },
    {
        // f
        "System Firmware Progress": [
            "System Firmware Error (POST Error)",
            "System Firmware Hang",
            "System Firmware Progress"
        ]
    },
    {
        // 0x10
        "Event Logging Disabled": [
            "Correctable Memory Error Logging Disabled",
            "Event `Type` Logging Disabled.",
            "Log Area Reset/Cleared",
            "All Event Logging Disabled",
            "SEL Full",
            "SEL Almost Full",
            "Correctable Machine Check Error Logging Disabled"
        ]
    },
    {
        // 0x11
        "Watchdog 1": [
            "BIOS Watchdog Reset",
            "OS Watchdog Reset",
            "OS Watchdog Shut Down",
            "OS Watchdog Power Down",
            "OS Watchdog Power Cycle",
            "OS Watchdog NMI / Diagnostic Interrupt",
            "OS Watchdog Expired, status only",
            "OS Watchdog pre-timeout Interrupt, non-NMI"
        ]
    },
    {
        // 0x12
        "System Event": [
            "System Reconfigured",
            "OEM System Boot Event",
            "Undetermined system hardware failure",
            "Entry added to Auxiliary Log",
            "PEF Action",
            "Timestamp Clock Synch."
        ]
    },
    {
        // 0x13
        "Critical Interrupt": [
            "Front Panel NMI / Diagnostic Interrupt",
            "Bus Timeout",
            "I/O channel check NMI",
            "Software NMI",
            "PCI PERR",
            "PCI SERR",
            "EISA Fail Safe Timeout",
            "Bus Correctable Error",
            "Bus Uncorrectable Error",
            "Fatal NMI (port 61h, bit 7)",
            "Bus Fatal Error",
            "Bus Degraded"
        ]
    },
    {
        // 0x14
        "Button / Switch": [
            "Power Button pressed",
            "Sleep Button pressed",
            "Reset Button pressed",
            "FRU latch open",
            "FRU service request button"
        ]
    },
    {
        // 0x15
        "Module / Board": []
    },
    {
        // 0x16
        "Microcontroller / Coprocessor": []
    },
    {
        // 0x17
        "Add-in Card": []
    },
    {
        // 0x18
        Chassis: []
    },
    {
        // 0x19
        "Chip Set": ["Soft Power Control Failure", "Thermal Trip"]
    },
    {
        // 0x1a
        "Other FRU": []
    },
    {
        // 0x1b
        "Cable / Interconnect": [
            "Cable/Interconnect is connected",
            "Configuration Error"
        ]
    },
    {
        // 0x1c
        Terminator: []
    },
    {
        // 0x1d
        "System Boot / Restart Initiated": [
            "Initiated by power up",
            "Initiated by hard reset (this would typically be generated by",
            "Initiated by warm reset (this would typically be generated by",
            "User requested PXE boot",
            "Automatic boot to diagnostic",
            "OS / run-time software initiated hard reset",
            "OS / run-time software initiated warm reset",
            "System Restart"
        ]
    },
    {
        // 0x1e
        "Boot Error": [
            "No bootable media",
            "Non-bootable diskette left in drive",
            "PXE Server not found",
            "Invalid boot sector",
            "Timeout waiting for user selection of boot source"
        ]
    },
    {
        // 0x1f
        "Base OS Boot / Installation Status": [
            "A: boot completed",
            "C: boot completed",
            "PXE boot completed",
            "Diagnostic boot completed",
            "CD-ROM boot completed",
            "ROM boot completed",
            "boot completed - boot device not specified",
            "Base OS/Hypervisor Installation started ",
            "Base OS/Hypervisor Installation completed",
            "Base OS/Hypervisor Installation aborted",
            "Base OS/Hypervisor Installation failed"
        ]
    },
    {
        // 0x20
        "OS Stop / Shutdown": [
            "Critical stop during OS load / initialization",
            "Run-time Critical Stop (a.k.a. `core dump`, `blue screen`)",
            "OS Graceful Stop",
            "OS Graceful Shutdown",
            "Soft Shutdown initiated by PEF",
            "Agent Not Responding"
        ]
    },
    {
        // 0x21
        "Slot / Connector": [
            "Fault Status asserted",
            "Identify Status asserted",
            "Slot / Connector Device installed/attached",
            "Slot / Connector Ready for Device Installation",
            "Slot/Connector Ready for Device Removal",
            "Slot Power is Off",
            "Slot / Connector Device Removal Request",
            "Interlock asserted",
            "Slot is Disabled",
            "Slot holds spare device"
        ]
    },
    {
        // 0x22
        "System ACPI Power State": [
            "S0 / G0 working",
            "S1 sleeping with system h/w & processor context maintained",
            "S2 sleeping, processor context lost",
            "S3 sleeping, processor & h/w context lost, memory retained",
            "S4 non-volatile sleep / suspend-to disk",
            "S5 / G2 soft-off",
            "S4 / S5 soft-off, particular S4 / S5 state cannot be determined",
            "G3 / Mechanical Off",
            "Sleeping in an S1, S2, or S3 states",
            "G1 sleeping",
            "S5 entered by override",
            "Legacy ON state",
            "Legacy OFF state",
            "unspecified",
            "Unknown"
        ]
    },
    {
        // 0x23
        "Watchdog 2": [
            "Timer expired, status only",
            "Hard Reset",
            "Power Down",
            "Power Cycle",
            "reserved",
            "reserved",
            "reserved",
            "reserved",
            "Timer interrupt"
        ]
    },
    {
        // 0x24
        "Platform Alert": [
            "platform generated page",
            "platform generated LAN alert",
            "Platform Event Trap generated",
            "platform generated SNMP trap, OEM format"
        ]
    },
    {
        // 0x25
        "Entity Presence": [
            "Entity Present",
            "Entity Absent",
            "Entity Disabled"
        ]
    },
    {
        // 0x26
        "Monitor ASIC / IC": []
    },
    {
        // 0x27
        LAN: ["LAN Heartbeat Lost", "LAN Heartbeat"]
    },
    {
        // 0x28
        "Management Subsystem Health": [
            "sensor access degraded or unavailable",
            "controller access degraded or unavailable",
            "management controller off-line",
            "management controller unavailable",
            "Sensor failure",
            "FRU failure"
        ]
    },
    {
        // 0x29
        Battery: [
            "battery low (predictive failure)",
            "battery failed",
            "battery presence detected"
        ]
    },
    {
        // 0x2a
        "Session Audit": [
            "Session Activated",
            "Session Deactivated",
            "Invalid Username or Password",
            "Invalid password disable"
        ]
    },
    {
        // 0x2b
        "Version Change": [
            "Hardware change detected with associated Entity",
            "Firmware or software change detected with associated Entity",
            "Hardware incompatibility detected with associated Entity",
            "Firmware or software incompatibility detected with associated Entity",
            "Entity is of an invalid or unsupported hardware version",
            "Entity contains an invalid or unsupported firmware or software version",
            "Hardware Change detected with associated Entity was successful",
            "Software or F/W Change detected with associated Entity was successful"
        ]
    },
    {
        // 0x2c
        "FRU State": [
            "FRU Not Installed",
            "FRU Inactive (in standby or `hot spare` state)",
            "FRU Activation Requested",
            "FRU Activation In Progress",
            "FRU Active",
            "FRU Deactivation Requested",
            "FRU Deactivation In Progress",
            "FRU Communication Lost"
        ]
    }
]

const event_data: {
    [sensor_type: number]: {
        [offset: number]: (selr: {
            event_data2: number
            event_data3: number
        }) => { d2?: string; d3?: string }
    }
} = {
    0x05: {
        // Physical Security
        0x04: (selr) => {
            // LAN Leash Lost
            return { d2: `network controller #${selr.event_data2}` }
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
                "Voltage rating mismatch"
            ]
            return {
                d3: error_types.indexOfOr(selr.event_data3 & 0xf, "reserved")
            }
        }
    },
    0x0c: {
        // Memory
        0x00: (selr) => {
            // 0~8h
            return { d3: `Memory #${selr.event_data3}` }
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
            ]
            return { d2: error_types.indexOfOr(selr.event_data2, "reserved") }
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
                "Primary processor initialization"
            ]
            return { d2: error_types.indexOfOr(selr.event_data2, "reserved") }
        }
    },
    0x10: {
        // Event Logging Disabled
        0x00: (selr) => {
            // Correctable Memory Error Logging Disabled
            return { d2: `Memory #${selr.event_data2}` }
        },
        0x01: (selr) => {
            // Event Type Logging Disabled
            const et = name_of_et(selr.event_data2)
            let s: string
            if (selr.event_data3 >> 5 === 1) {
                s = "logging has been disabled for all events of given type"
            } else {
                const dir = selr.event_data3 >> 4 === 1 ? "assert" : "deassert"
                const os = p_event(
                    selr.event_data2,
                    selr.event_data3 & 0xf,
                    0xff
                )
                s = `logging is disabled for ${dir}: ${os}`
            }
            return { d2: et, d3: s }
        },
        0x05: (selr) => {
            // SEL Almost Full
            return { d3: `${selr.event_data3}% full` }
        },
        0x06: (selr) => {
            // Correctable Machine Check Error Logging Disabled
            const x = (selr.event_data3 >> 7) & 1
            const d3 =
                x === 0
                    ? "Entity Instance number"
                    : "Vendor-specific processor number"
            return { d2: `#${selr.event_data2}`, d3 }
        }
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
                "log enabled"
            ]
            const types = ["MCA Log", "OEM 1", "OEM 2"]
            const a = actions.indexOfOr(
                (selr.event_data2 >> 4) & 0xf,
                "reserved"
            )
            const t = types.indexOfOr(selr.event_data2 & 0xf, "reserved")
            return { d2: `${t}, ${a}` }
        },
        0x04: (selr) => {
            // PEF Action
            const actions = [
                "Alert",
                "power off",
                "reset",
                "power cycle",
                "OEM action",
                "Diagnostic Interrupt (NMI)"
            ]
            const a = actions.bitsOr(selr.event_data2, "reserved")
            return { d2: a.join(", ") }
        },
        0x05: (selr) => {
            // Timestamp Clock Synch.
            const p =
                selr.event_data2 >> 7 === 0 ? "first of pair" : "second of pair"
            const t =
                (selr.event_data2 & 0xf) === 0
                    ? "SEL Timestamp Clock updated"
                    : "SDR Timestamp Clock updated"
            return { d2: `${t}, ${p}` }
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
                "Legacy OFF state"
            ]
            const r = types.indexOfOr(selr.event_data2, "reserved")
            const c = types.indexOfOr(selr.event_data3, "reserved")
            return {
                d2: `Requested power state: ${r}`,
                d3: `Power state at time of request: ${c}`
            }
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
                "power-up via RTC"
            ]
            return {
                d2: causes.indexOfOr(selr.event_data2, "reserved"),
                d3: `from channel #${selr.event_data3}`
            }
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
            ]
            return {
                d2: types.indexOfOr(selr.event_data2 & 0x7f, "reserved"),
                d3: `Slot/Connector #${selr.event_data3}`
            }
        }
    },
    0x23: {
        // watchdog 2
        0x00: (selr) => {
            // 0~3, 8h
            const types = ["none", "SMI", "NMI", "Messaging Interrupt"]
            const uses = [
                "reserved",
                "BIOS FRB2",
                "BIOS/POST",
                "OS Load",
                "SMS/OS",
                "OEM"
            ]
            const t = types.indexOfOr(
                (selr.event_data2 >> 4) & 0xf,
                "unspecified"
            )
            const u = uses.indexOfOr(selr.event_data2 & 0xf, "unspecified")
            return { d2: `interrupt type: ${t}, timer use: ${u}` }
        }
    },
    0x28: {
        // management subsystem health
        0x04: (selr) => {
            // sensor failure
            return { d2: `sensor number ${selr.event_data2.toHexh()}` }
        },
        0x05: (selr) => {
            // FRU failure
            const ed2 = selr.event_data2
            const isLogic = ((ed2 >> 7) & 1) === 1
            const d2 = `device is${
                isLogic ? "" : " not"
            } a logical FRU Device, LUN ${(ed2 >> 3) & 0x3}, bus ID ${ed2 & 3}`
            let d3: string
            if (isLogic) {
                d3 = "FRU Device ID"
            } else {
                d3 = "7-bit I2C Slave Address of FRU device"
            }
            d3 += `: ${selr.event_data3.toHexh()}`
            return { d2, d3 }
        }
    },
    0x2a: {
        // session audit
        0x03: (selr) => {
            // invalid password disable
            const user = selr.event_data2 & 0x3f
            const causes = [
                "Session deactivatation cause unspecified",
                "Session deactivated by Close Session command",
                "Session deactivated by timeout",
                "Session deactivated by configuration change"
            ]
            const cause = causes.indexOfOr(
                (selr.event_data3 >> 4) & 3,
                "reserved"
            )
            const ch = selr.event_data3 & 0xf
            return { d2: `user ID: #${user}`, d3: `${cause}, channel #${ch}` }
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
                "board/FRU hardware configuration change (e.g. strap, jumper, cable change, etc.)"
            ]
            return { d2: types.indexOfOr(selr.event_data2, "reserved") }
        }
    }
}

// memory offset 0~8h
for (let i = 1; i <= 8; i++) {
    event_data[0x0c][i] = event_data[0x0c][0x00]
}
// System Firmware Hang
event_data[0x0f][0x01] = event_data[0x0f][0x00]
// slot/connector offset 0~9h
for (let i = 1; i <= 9; i++) {
    event_data[0x21][i] = event_data[0x21][0x00]
}
// watchdog 2 offset 0~3, 8h
for (let i = 1; i <= 3; i++) {
    event_data[0x23][i] = event_data[0x23][0x00]
}
event_data[0x23][8] = event_data[0x23][0x00]

const ipmi = {
    event_data_field,
    generic_event_type_codes,
    sensor_type_codes,
    event_data
}

enum EventType {
    threshold = 1,
    sensor_specific = 0x6f
}

enum SdrRecordType {
    Full = 1,
    Compact = 2,
    EventOnly = 3,
    FruDeviceLocator = 0x11,
    ManagementControllerDeviceLocator = 0x12,
    OEM = 0xc0
}

enum Linearization {
    linear,
    ln,
    log10,
    log2,
    e,
    exp10,
    exp2,
    reciprocal,
    sqr,
    cube,
    sqrt,
    cubeByNegOne
}

enum SensorUnitTypeCodes {
    "unspecified",
    "degrees C",
    "degrees F",
    "degrees K",
    "Volts",
    "Amps",
    "Watts",
    "Joules",
    "Coulombs",
    "VA",
    "Nits",
    "lumen",
    "lux",
    "Candela",
    "kPa",
    "PSI",
    "Newton",
    "CFM",
    "RPM",
    "Hz",
    "microsecond",
    "millisecond",
    "second",
    "minute",
    "hour",
    "day",
    "week",
    "mil",
    "inches",
    "feet",
    "cu in",
    "cu feet",
    "mm",
    "cm",
    "m",
    "cu cm",
    "cu m",
    "liters",
    "fluid ounce",
    "radians",
    "steradians",
    "revolutions",
    "cycles",
    "gravities",
    "ounce",
    "pound",
    "ft-lb",
    "oz-in",
    "gauss",
    "gilberts",
    "henry",
    "millihenry",
    "farad",
    "microfarad",
    "ohms",
    "siemens",
    "mole",
    "becquerel",
    "PPM",
    "reserved",
    "Decibels",
    "DbA",
    "DbC",
    "gray",
    "sievert",
    "color temp deg K",
    "bit",
    "kilobit",
    "megabit",
    "gigabit",
    "byte",
    "kilobyte",
    "megabyte",
    "gigabyte",
    "word",
    "dword",
    "qword",
    "line",
    "hit",
    "miss",
    "retry",
    "reset",
    "overrun / overflow",
    "underrun",
    "collision",
    "packets",
    "messages",
    "characters",
    "error",
    "correctable error",
    "uncorrectable error",
    "fatal error",
    "grams"
}

function name_of_sdr_rt(n: number) {
    return name_of(SdrRecordType, n)
}
function name_of_linear(n: number) {
    return name_of(Linearization, n)
}
function name_of_unit(n: number) {
    return name_of(SensorUnitTypeCodes, n)
}

function name_of_sel_rt(n: number) {
    if (n === 2) {
        return "system event"
    }
    if (n >= 0xc0 && n <= 0xdf) {
        return "OEM timestamped"
    }
    if (n >= 0xe0 && n <= 0xff) {
        return "OEM non-timestamped"
    }
    return "unspecified"
}
function name_of_et(n: number) {
    n = n & 0x7f
    if (n === 0) {
        return "unspecified"
    }
    if (n === 1) {
        return "threshold"
    }
    if (n >= 0x2 && n <= 0xc) {
        return Object.keys(ipmi.generic_event_type_codes[n])[0]
    }
    if (n === 0x6f) {
        return "sensor-specific"
    }
    if (n >= 0x70 && n <= 0x7f) {
        return "OEM"
    }
    // 0dh-6eh
    return "reserved"
}
function name_of_st(n: number) {
    if (n < ipmi.sensor_type_codes.length) {
        return Object.keys(ipmi.sensor_type_codes[n])[0]
    }
    if (n >= 0xc0 && n <= 0xff) {
        return "OEM"
    }
    return "reserved"
}
function p_edf(et: number, n: number) {
    // table 29-6 event data field
    et = et & 0x7f
    let k: string
    if (et === 1) {
        k = "threshold"
    } else if (et >= 0x2 && et <= 0xc) {
        k = "discrete"
    } else if (et === 0x6f) {
        k = "discrete"
    } else {
        k = "OEM"
    }
    const b76 = (n >> 6) & 0x3
    const b54 = (n >> 4) & 0x3
    // console.log('n ' + (n >> 4) + ', k ' + k + ', b76 ' + b76 + ', b54 ' + b54)
    return (
        ipmi.event_data_field[k].b76[b76] +
        ", " +
        ipmi.event_data_field[k].b54[b54]
    )
}
function p_event(n: number, offset: number, sensor_type: number) {
    n = n & 0x7f
    offset = offset & 0xf

    if (n === 0) {
        return "unspecified"
    }
    if (n >= 0x1 && n <= 0xc) {
        return p_generic_event(n, offset)
    }
    if (n === 0x6f) {
        return p_sensor_event(sensor_type, offset)
    }

    if (n >= 0x70 && n <= 0x7f) {
        return "OEM"
    } else {
        // [0xd, 0x6e]
        return "reserved"
    }
}
function p_generic_event(n: number, offset: number) {
    const x = ipmi.generic_event_type_codes[n]
    const values = Object.values(x)[0]
    if (offset >= values.length) {
        return "unspecified"
    }
    return values[offset]
}
function p_sensor_event(n: number, offset: number) {
    if (n === 0) {
        return "reserved"
    }
    if (n >= ipmi.sensor_type_codes.length && n <= 0xc0) {
        return "reserved"
    }
    if (n >= 0xc0 && n <= 0xff) {
        return "OEM"
    }

    // n in range: [01h, ipmi.sensor_type_codes.length)
    const x = ipmi.sensor_type_codes[n]
    const name = Object.keys(x)[0]
    const values = Object.values(x)[0]
    if (n >= 1 && n <= 4) {
        return name
    }
    // n in range: [05h, ipmi.sensor_type_codes.length)
    if (offset >= values.length) {
        return "unspecified"
    }
    return values[offset]
}

export { ipmi }
export { EventType, SdrRecordType, Linearization, SensorUnitTypeCodes }
export {
    name_of_sdr_rt,
    name_of_linear,
    name_of_unit,
    name_of_sel_rt,
    name_of_et,
    name_of_st
}
export { p_event, p_edf }
