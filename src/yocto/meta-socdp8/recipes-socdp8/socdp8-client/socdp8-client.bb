# Recipe created by recipetool

SUMMARY = "SoCDP8 client application"
PV = "0.0.1"
PR = "r3"

LICENSE = "AGPL-3.0 & MIT"
LIC_FILES_CHKSUM = "file://COPYING;md5=eb1e647870add0502f8f010b19de32af"

SRC_URI = "file://socdp8-client-${PV}.tgz"

inherit npm

S = "${WORKDIR}/package"
