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
    exports.test_data = void 0;
    function test_data() {
        const test_data = `
00000000:	0100	5101	3520	0001
00000008:	0300	7f68	0101	800a
00000010:	807a	3838	0001	0000
00000018:	0600	0000	00f0	0797
00000020:	ff00	ff00	4d4b	4200
00000028:	8388	0000	0000	00ca
00000030:	496e	6c65	745f	5465
00000038:	6d70	0200	5101	3620
00000040:	0002	0300	7f68	0101
00000048:	800a	807a	3838	0001
00000050:	0000	0600	0000	00f0
00000058:	0797	ff00	ff00	7f7d
00000060:	7500	8388	0000	0000
00000068:	00cb	4f75	746c	6574
00000070:	5f54	656d	7003	0051
00000078:	0134	2000	0303	007f
00000080:	6801	0180	0a80	7a38
00000088:	3800	0100	0005	0000
00000090:	0000	f007	97ff	00ff
00000098:	007f	afaa	0000	0000
000000a0:	0000	0000	c943	5055
000000a8:	305f	5465	6d70	0400
000000b0:	5101	3420	0004	0300
000000b8:	7f68	0101	800a	807a
000000c0:	3838	0001	0000	0500
000000c8:	0000	00f0	0797	ff00
000000d0:	ff00	7faf	aa00	0000
000000d8:	0000	0000	00c9	4350
000000e0:	5531	5f54	656d	7005
000000e8:	0051	0137	2000	0703
000000f0:	007f	6801	0180	0a80
000000f8:	7a38	3800	0100	0001
00000100:	0000	0000	0007	20ff
00000108:	00ff	0078	736e	0000
00000110:	0000	0000	0000	cc43
00000118:	5055	305f	5652	5f54
00000120:	656d	7006	0051	0137
00000128:	2000	0803	007f	6801
00000130:	0180	0a80	7a38	3800
00000138:	0100	0001	0000	0000
00000140:	0007	20ff	00ff	0078
00000148:	736e	0000	0000	0000
00000150:	0000	cc43	5055	315f
00000158:	5652	5f54	656d	7007
00000160:	0051	0136	2000	0b03
00000168:	007f	6801	0180	0a80
00000170:	7a38	3800	0100	0001
00000178:	0000	0000	0007	97ff
00000180:	00ff	0064	5a52	0000
00000188:	0000	0000	0000	cb44
00000190:	494d	4d47	305f	5465
00000198:	6d70	0800	5101	3620
000001a0:	000c	0300	7f68	0101
000001a8:	800a	807a	3838	0001
000001b0:	0000	0100	0000	0000
000001b8:	0797	ff00	ff00	645a
000001c0:	5200	0000	0000	0000
000001c8:	00cb	4449	4d4d	4731
000001d0:	5f54	656d	7009	0051
000001d8:	0133	2000	0f03	007f
000001e0:	6801	0180	0a80	7a38
000001e8:	3800	0100	0001	0000
000001f0:	0000	0007	97ff	00ff
000001f8:	006e	5a53	0083	8800
00000200:	0000	0000	c850	4348
00000208:	5f54	656d	700a	0051
00000210:	0133	2000	3007	007f
00000218:	6802	0195	0a95	0a3f
00000220:	3f00	0400	0002	0000
00000228:	0000	e000	7fff	00ff
00000230:	00c5	bdb5	848c	9400
00000238:	0000	0000	c853	5953
00000240:	5f33	2e33	560b	0051
00000248:	013b	2000	3107	007f
00000250:	6802	0195	0a95	0a3f
00000258:	3f00	0400	0002	0000
00000260:	0000	e000	7fff	00ff
00000268:	00c5	bdb5	848c	9400
00000270:	0000	0000	d053	5953
00000278:	5f33	2e33	565f	5374
00000280:	616e	6462	790c	0051
00000288:	0131	2000	3207	007f
00000290:	6802	0195	0a95	0a3f
00000298:	3f00	0400	0003	0000
000002a0:	0000	e000	7fff	00ff
000002a8:	00c8	bfb7	858d	9600
000002b0:	0000	0000	c653	5953
000002b8:	5f35	560d	0051	0139
000002c0:	2000	3307	007f	6802
000002c8:	0195	0a95	0a3f	3f00
000002d0:	0400	0003	0000	0000
000002d8:	e000	7fff	00ff	00c8
000002e0:	bfb7	858d	9600	0000
000002e8:	0000	ce53	5953	5f35
000002f0:	565f	5374	616e	6462
000002f8:	790e	0051	0132	2000
00000300:	3407	007f	6802	0195
00000308:	0a95	0a3f	3f00	0400
00000310:	0008	0000	0000	e000
00000318:	7fff	00ff	00c3	bbb3
00000320:	7981	8800	0000	0000
00000328:	c753	5953	5f31	3256
00000330:	0f00	5101	3520	0036
00000338:	0700	7f68	0201	950a
00000340:	950a	3f3f	0004	0000
00000348:	0100	0000	00e0	007f
00000350:	ff00	ff00	e3da	d17c
00000358:	838b	0000	0000	00ca
00000360:	4350	5530	5f56	434f
00000368:	5245	1000	5101	3520
00000370:	0037	0700	7f68	0201
00000378:	950a	950a	3f3f	0004
00000380:	0000	0100	0000	00e0
00000388:	007f	ff00	ff00	e3da
00000390:	d17c	838b	0000	0000
00000398:	00ca	4350	5531	5f56
000003a0:	434f	5245	1100	5101
000003a8:	3720	003a	0700	7f68
000003b0:	0201	950a	950a	3f3f
000003b8:	0004	0000	0100	0000
000003c0:	00e0	007f	ff00	ff00
000003c8:	908a	8460	666c	0000
000003d0:	0000	00cc	4350	5530
000003d8:	5f44	4452	5f56	4444
000003e0:	1200	5101	3720	003b
000003e8:	0700	7f68	0201	950a
000003f0:	950a	3f3f	0004	0000
000003f8:	0100	0000	00e0	007f
00000400:	ff00	ff00	908a	8460
00000408:	666c	0000	0000	00cc
00000410:	4350	5531	5f44	4452
00000418:	5f56	4444	1300	5101
00000420:	3620	003e	0700	7f68
00000428:	0201	950a	950a	3f3f
00000430:	0004	0000	0200	0000
00000438:	00e0	007f	ff00	ff00
00000440:	c5bd	b584	8c94	0000
00000448:	0000	00cb	5359	535f
00000450:	332e	3356	4241	5414
00000458:	0051	013a	2000	4003
00000460:	007f	680b	0100	0000
00000468:	0000	0000	0600	0005
00000470:	0000	0000	0007	97ff
00000478:	00ff	0000	ff00	0000
00000480:	0000	0000	0000	cf4e
00000488:	6f64	655f	4d61	696e
00000490:	5f50	6f77	6572	1500
00000498:	5101	3820	0041	0300
000004a0:	7f68	0b01	0000	0000
000004a8:	0000	0006	0000	0200
000004b0:	0000	0000	0797	ff00
000004b8:	ff00	00ff	0000	0000
000004c0:	0000	0000	00cd	4e6f
000004c8:	6465	5f53	425f	506f
000004d0:	7765	7216	0051	0134
000004d8:	2000	4203	007f	680b
000004e0:	0100	0000	0000	0000
000004e8:	0600	0001	0000	0000
000004f0:	0007	97ff	00ff	0000
000004f8:	ff00	0000	0000	0000
00000500:	0000	c950	4442	5f50
00000508:	6f77	6572	1700	5102
00000510:	2620	0070	0600	6740
00000518:	076f	ab08	0000	ab08
00000520:	c000	0000	0000	0000
00000528:	0000	00cb	4350	5530
00000530:	5f53	7461	7475	7318
00000538:	0051	0226	2000	7106
00000540:	0067	4007	6fab	0800
00000548:	00ab	08c0	0000	0000
00000550:	0000	0000	0000	cb43
00000558:	5055	315f	5374	6174
00000560:	7573	1900	5102	2720
00000568:	0074	0300	6740	0703
00000570:	0200	0200	0200	c000
00000578:	0000	0000	0000	0000
00000580:	00cc	4350	5530	5f50
00000588:	726f	6368	6f74	1a00
00000590:	5102	2720	0075	0300
00000598:	6740	0703	0200	0200
000005a0:	0200	c000	0000	0000
000005a8:	0000	0000	00cc	4350
000005b0:	5531	5f50	726f	6368
000005b8:	6f74	1b00	5101	3a20
000005c0:	0081	0300	7f68	0b01
000005c8:	0000	0000	0000	0006
000005d0:	0000	0100	0000	0000
000005d8:	0797	ff00	ff00	ffaf
000005e0:	aa00	8388	0000	0000
000005e8:	00cf	4350	555f	546f
000005f0:	7461	6c5f	506f	7765
000005f8:	721c	0051	013a	2000
00000600:	8203	007f	680b	0100
00000608:	0000	0000	0000	0600
00000610:	0001	0000	0000	0007
00000618:	97ff	00ff	00ff	afaa
00000620:	0083	8800	0000	0000
00000628:	cf4d	454d	5f54	6f74
00000630:	616c	5f50	6f77	6572
00000638:	1d00	5101	3620	0084
00000640:	0300	7f68	0b01	0000
00000648:	0000	0000	0006	0000
00000650:	0500	0000	0000	0797
00000658:	ff00	ff00	00ff	0000
00000660:	0000	0000	0000	00cb
00000668:	546f	7461	6c5f	506f
00000670:	7765	721e	0051	0222
00000678:	2000	9008	0067	400c
00000680:	6fa3	0000	00a3	00c0
00000688:	0000	0000	0000	0000
00000690:	0000	c743	5055	305f
00000698:	4130	1f00	5102	2220
000006a0:	0091	0800	6740	0c6f
000006a8:	a300	0000	a300	c000
000006b0:	0000	0000	0000	0000
000006b8:	00c7	4350	5530	5f41
000006c0:	3120	0051	0222	2000
000006c8:	9208	0067	400c	6fa3
000006d0:	0000	00a3	00c0	0000
000006d8:	0000	0000	0000	0000
000006e0:	c743	5055	305f	4230
000006e8:	2100	5102	2220	0094
000006f0:	0800	6740	0c6f	a300
000006f8:	0000	a300	c000	0000
00000700:	0000	0000	0000	00c7
00000708:	4350	5530	5f43	3022
00000710:	0051	0222	2000	9608
00000718:	0067	400c	6fa3	0000
00000720:	00a3	00c0	0000	0000
00000728:	0000	0000	0000	c743
00000730:	5055	305f	4430	2300
00000738:	5102	2220	0097	0800
00000740:	6740	0c6f	a300	0000
00000748:	a300	c000	0000	0000
00000750:	0000	0000	00c7	4350
00000758:	5530	5f44	3124	0051
00000760:	0222	2000	9808	0067
00000768:	400c	6fa3	0000	00a3
00000770:	00c0	0000	0000	0000
00000778:	0000	0000	c743	5055
00000780:	305f	4530	2500	5102
00000788:	2220	009a	0800	6740
00000790:	0c6f	a300	0000	a300
00000798:	c000	0000	0000	0000
000007a0:	0000	00c7	4350	5530
000007a8:	5f46	3026	0051	0222
000007b0:	2000	9c08	0067	400c
000007b8:	6fa3	0000	00a3	00c0
000007c0:	0000	0000	0000	0000
000007c8:	0000	c743	5055	315f
000007d0:	4130	2700	5102	2220
000007d8:	009d	0800	6740	0c6f
000007e0:	a300	0000	a300	c000
000007e8:	0000	0000	0000	0000
000007f0:	00c7	4350	5531	5f41
000007f8:	3128	0051	0222	2000
00000800:	9e08	0067	400c	6fa3
00000808:	0000	00a3	00c0	0000
00000810:	0000	0000	0000	0000
00000818:	c743	5055	315f	4230
00000820:	2900	5102	2220	00a0
00000828:	0800	6740	0c6f	a300
00000830:	0000	a300	c000	0000
00000838:	0000	0000	0000	00c7
00000840:	4350	5531	5f43	302a
00000848:	0051	0222	2000	a208
00000850:	0067	400c	6fa3	0000
00000858:	00a3	00c0	0000	0000
00000860:	0000	0000	0000	c743
00000868:	5055	315f	4430	2b00
00000870:	5102	2220	00a3	0800
00000878:	6740	0c6f	a300	0000
00000880:	a300	c000	0000	0000
00000888:	0000	0000	00c7	4350
00000890:	5531	5f44	312c	0051
00000898:	0222	2000	a408	0067
000008a0:	400c	6fa3	0000	00a3
000008a8:	00c0	0000	0000	0000
000008b0:	0000	0000	c743	5055
000008b8:	315f	4530	2d00	5102
000008c0:	2220	00a6	0800	6740
000008c8:	0c6f	a300	0000	a300
000008d0:	c000	0000	0000	0000
000008d8:	0000	00c7	4350	5531
000008e0:	5f46	302e	0051	0226
000008e8:	2000	e00b	0067	4017
000008f0:	0803	0000	0003	00c0
000008f8:	0000	0181	0000	0000
00000900:	0000	cb4d	455a	5a5f
00000908:	305f	5052	4553	2f00
00000910:	5102	2620	00e1	0b00
00000918:	6740	1708	0300	0000
00000920:	0300	c000	0001	8100
00000928:	0000	0000	00cb	4d45
00000930:	5a5a	5f31	5f50	5245
00000938:	5330	0051	0228	2000
00000940:	e20b	0067	4017	0803
00000948:	0000	0003	00c0	0000
00000950:	0181	0000	0000	0000
00000958:	cd41	6464	2d49	6e5f
00000960:	305f	5052	4553	3100
00000968:	5102	2820	00e3	0b00
00000970:	6740	1708	0300	0000
00000978:	0300	c000	0001	8100
00000980:	0000	0000	00cd	4164
00000988:	642d	496e	5f31	5f50
00000990:	5245	5332	0051	0226
00000998:	2000	f007	0067	4015
000009a0:	0704	0000	0004	00c0
000009a8:	0000	0000	0000	0000
000009b0:	0000	cb4d	6f74	6865
000009b8:	7242	6f61	7264	3300
000009c0:	5102	2520	00f1	0600
000009c8:	6340	226f	2100	0000
000009d0:	2100	c000	0000	0000
000009d8:	0000	0000	00ca	4143
000009e0:	5049	5f53	7461	7465
000009e8:	3400	5102	2720	00f2
000009f0:	0700	6740	146f	0100
000009f8:	0000	0100	c000	0000
00000a00:	0000	0000	0000	00cc
00000a08:	506f	7765	725f	4275
00000a10:	7474	6f6e	3500	5102
00000a18:	2a20	00f3	2200	6740
00000a20:	0f6f	0300	0000	0300
00000a28:	c000	0000	0000	0000
00000a30:	0000	00cf	5359	535f
00000a38:	4657	5f50	726f	6772
00000a40:	6573	7336	0051	022b
00000a48:	2000	f422	00e7	401d
00000a50:	6f06	0000	0006	00c0
00000a58:	0000	0000	0000	0000
00000a60:	0000	d052	6573	7461
00000a68:	7274	5f49	6e69	7469
00000a70:	6174	6537	0051	0224
00000a78:	2000	f506	0063	4023
00000a80:	6f0f	0100	000f	01c0
00000a88:	0000	0000	0000	0000
00000a90:	0000	c957	6174	6368
00000a98:	646f	6732	3800	5102
00000aa0:	2420	00f6	0600	6340
00000aa8:	106f	1400	0000	1400
00000ab0:	c000	0000	0000	0000
00000ab8:	0000	00c9	4576	656e
00000ac0:	745f	4c6f	6739	0051
00000ac8:	0135	2000	f703	007f
00000ad0:	680b	0100	0000	0000
00000ad8:	0000	0600	0001	0000
00000ae0:	0000	0007	97ff	00ff
00000ae8:	00ff	afaa	0083	8800
00000af0:	0000	0000	ca43	5055
00000af8:	305f	506f	7765	723a
00000b00:	0051	0135	2000	f803
00000b08:	007f	680b	0100	0000
00000b10:	0000	0000	0600	0001
00000b18:	0000	0000	0007	97ff
00000b20:	00ff	00ff	afaa	0083
00000b28:	8800	0000	0000	ca43
00000b30:	5055	315f	506f	7765
00000b38:	723b	0051	0316	2000
00000b40:	fe31	0013	6f00	0000
00000b48:	00ca	5043	4945	5f41
00000b50:	6c65	7274	3c00	5112
00000b58:	1220	0000	ff00	0000
00000b60:	0000	00c7	4153	5432
00000b68:	3530	303d	0051	c00e
00000b70:	5701	000d	012c	6000
00000b78:	0000	0002	4e4d	3e00
00000b80:	5111	1220	0087	0000
00000b88:	0802	0700	00c7	4d42
00000b90:	5f46	5255	303f	0051
00000b98:	1113	2001	8700	0008
00000ba0:	0207	0000	c843	5055
00000ba8:	5f46	5255	3140	0051
00000bb0:	1113	2002	8700	0008
00000bb8:	0207	0000	c843	5055
00000bc0:	5f46	5255	3241	0051
00000bc8:	1114	2003	8700	0008
00000bd0:	0207	0000	c944	494d
00000bd8:	4d5f	4652	5533	4200
00000be0:	5111	1420	0487	0000
00000be8:	0802	0700	00c9	4449
00000bf0:	4d4d	5f46	5255	3443
00000bf8:	0051	1114	2005	8700
00000c00:	0008	0207	0000	c944
00000c08:	494d	4d5f	4652	5535
00000c10:	4400	5111	1420	0687
00000c18:	0000	0802	0700	00c9
00000c20:	4449	4d4d	5f46	5255
00000c28:	3645	0051	1114	2007
00000c30:	8700	0008	0207	0000
00000c38:	c944	494d	4d5f	4652
00000c40:	5537	4600	5111	1420
00000c48:	0887	0000	0802	0700
00000c50:	00c9	4449	4d4d	5f46
00000c58:	5255	3847	0051	1114
00000c60:	2009	8700	0008	0207
00000c68:	0000	c944	494d	4d5f
00000c70:	4652	5539	4800	5111
00000c78:	1520	0a87	0000	0802
00000c80:	0700	00ca	4449	4d4d
00000c88:	5f46	5255	3130	4900
00000c90:	5111	1520	0b87	0000
00000c98:	0802	0700	00ca	4449
00000ca0:	4d4d	5f46	5255	3131
00000ca8:	4a00	5111	1520	0c87
00000cb0:	0000	0802	0700	00ca
00000cb8:	4449	4d4d	5f46	5255
00000cc0:	3132	4b00	5111	1520
00000cc8:	0d87	0000	0802	0700
00000cd0:	00ca	4449	4d4d	5f46
00000cd8:	5255	3133	4c00	5111
00000ce0:	1520	0e87	0000	0802
00000ce8:	0700	00ca	4449	4d4d
00000cf0:	5f46	5255	3134	4d00
00000cf8:	5111	1520	0f87	0000
00000d00:	0802	0700	00ca	4449
00000d08:	4d4d	5f46	5255	3135
00000d10:	4e00	5111	1520	1087
00000d18:	0000	0802	0700	00ca
00000d20:	4449	4d4d	5f46	5255
00000d28:	3136	4f00	5111	1520
00000d30:	1187	0000	0802	0700
00000d38:	00ca	4449	4d4d	5f46
00000d40:	5255	3137	5000	5111
00000d48:	1520	1287	0000	0802
00000d50:	0700	00ca	4449	4d4d
00000d58:	5f46	5255	3138	5100
00000d60:	5111	1a20	1387	0000
00000d68:	0802	0700	00cf	5043
00000d70:	4965	5f43	6172	645f
00000d78:	4652	5531	3952	0051
00000d80:	111a	2014	8700	0008
00000d88:	0207	0000	cf50	4349
00000d90:	655f	4361	7264	5f46
00000d98:	5255	3230	5300	5111
00000da0:	1920	1587	0000	0802
00000da8:	0700	00ce	4f43	505f
00000db0:	4361	7264	5f46	5255
00000db8:	3231	5400	5111	1920
00000dc0:	1687	0000	0802	0700
00000dc8:	00ce	4d2e	325f	4361
00000dd0:	7264	5f46	5255	3232
00000dd8:	5500	5111	1420	1787
00000de0:	0000	0802	0700	00c9
00000de8:	4844	445f	4652	5532
00000df0:	3356	0051	1114	2018
00000df8:	8700	0008	0207	0000
00000e00:	c948	4444	5f46	5255
00000e08:	3234	5700	5111	1420
00000e10:	1987	0000	0802	0700
00000e18:	00c9	4844	445f	4652
00000e20:	5532	3558	0051	1114
00000e28:	201a	8700	0008	0207
00000e30:	0000	c948	4444	5f46
00000e38:	5255	3236	5900	5111
00000e40:	1420	1b87	0000	0802
00000e48:	0700	00c9	4844	445f
00000e50:	4652	5532	375a	0051
00000e58:	1114	201c	8700	0008
00000e60:	0207	0000	c948	4444
00000e68:	5f46	5255	3238	5b00
00000e70:	5111	1420	1d87	0000
00000e78:	0802	0700	00c9	4844
00000e80:	445f	4652	5532	395c
00000e88:	0051	1114	201e	8700
00000e90:	0008	0207	0000	c948
00000e98:	4444	5f46	5255	3330
00000ea0:	5d00	5111	1520	8087
00000ea8:	0000	0802	0700	00ca
00000eb0:	4250	315f	4652	5531
00000eb8:	3238	5e00	5111	1520
00000ec0:	8187	0000	0802	0700
00000ec8:	00ca	4250	345f	4652
00000ed0:	5531	3239	5f00	5111
00000ed8:	1720	8287	0000	0802
00000ee0:	0700	00cc	5269	7365
00000ee8:	725f	4652	5531	3330
00000ef0:	6000	5111	1720	8387
00000ef8:	0000	0802	0700	00cc
00000f00:	5269	7365	725f	4652
00000f08:	5531	3331	6100	5111
00000f10:	1520	8487	0000	0802
00000f18:	0700	00ca	5044	425f
00000f20:	4652	5531	3332
`;
        const ns = [];
        const hex = test_data.split('\n')
            .filter(i => i.startsWith('0000'))
            .forEach(j => j.split(/\s+/).slice(1)
            .forEach(k => {
            ns.push(parseInt(k.substr(0, 2), 16));
            ns.push(parseInt(k.substr(2, 2), 16));
        }));
        const ab = new ArrayBuffer(ns.length);
        const ua = new Uint8Array(ab);
        ns.forEach((v, i) => {
            ua[i] = ns[i];
        });
        return ab;
    }
    exports.test_data = test_data;
});
//# sourceMappingURL=test_data.js.map