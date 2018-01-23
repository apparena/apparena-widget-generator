/* eslint-env browser */
/* globals AM_DIST_PATH */

/** Dynamically set absolute public path from current protocol and host */
if (AM_DIST_PATH) {
    __webpack_public_path__ = AM_DIST_PATH; // eslint-disable-line no-undef, camelcase
}
