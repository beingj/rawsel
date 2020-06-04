(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class IPMI_Spec {
    }
    IPMI_Spec.event_data23 = {
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
    IPMI_Spec.generic_event_type_codes = [
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
    IPMI_Spec.sensor_type_codes = [
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
                'Power Supply input lost (AC/DC) [2]',
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
    exports.IPMI_Spec = IPMI_Spec;
});
