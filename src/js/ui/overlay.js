
/*jslint browser: true, node: true */
/*global $, bind, PAPAYA_TITLEBAR_CSS, derefIn, PAPAYA_DIALOG_CSS, PAPAYA_MENU_ICON_CSS, PAPAYA_MENU_LABEL_CSS,
 PAPAYA_MENU_BUTTON_CSS, PAPAYA_MENU_CSS, PAPAYA_DIALOG_BACKGROUND, PAPAYA_MENU_TITLEBAR_CSS, isInputRangeSupported,
 launchCustomProtocol, PAPAYA_BROWSER, alert, confirm, getAbsoluteUrl, PAPAYA_CUSTOM_PROTOCOL */

"use strict";

var papaya = papaya || {};
papaya.ui = papaya.ui || {};

var papayaLoadableImages = papayaLoadableImages || [];

papaya.ui.Overlay = papaya.ui.Overlay || function (container) {
    this.container = container;
    this.viewer = container.viewer;
    this.imageMenus = null;
    this.spaceMenu = null;
};


papaya.ui.Overlay.SIZE = 150;

// http://dataurl.net/#dataurlmaker
//papaya.ui.Toolbar.ICON_IMAGESPACE = "data:image/gif;base64,R0lGODlhFAAUAPcAMf//////GP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////2f/ZNbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1tbW1qWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpVpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWlpaWkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACoALAAAAAAUABQAAAipAFUIHEiwoMB/A1coXLiwisOHVf4hVLFCosWLGC9SzMgR48Z/VEJSUVjFj0mTESdWBCmS5EmU/6oIXCly5IqSLx/OlFjT5Us/DneybIkzp8yPDElChCjwj8Q/UKOqmkqVatOnUaGqmsaVq1UVTv+lGjv2z9SuXlVdFUs2ldmtaKeubev2bFy1YCXSfYt2mty8/6CS5XtXRcasVRMftJj1beK/hicanKwiIAA7";
//papaya.ui.Toolbar.ICON_WORLDSPACE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAplJREFUeNqM1H1ozVEcx/Hr3p+7O08jQzbzMErznEItK0+Fv0Ye/tki20ia//wn+YMSaXkoEiKkkCVKZhOipsnDstnFagzlrmGMNfeO6/Nd71unu2s59bq7O517ft/z/X7Pz+dLPUbLJrkqX+SbdEubfJZK2cC6PiOQYm61HJcpkintEpcmCcpryZV5spaHhvvbdJ9slsPyU67wgPlEli0X5aiMkMeyXSbKnVRRVxDRRtkm5czbZrv5vkgu8z1P9stWfleRHGkhT3xCLu1YzZIjpfKWnA6VEn43mwcWEaWlo1Ve2YZj5Jms53iP5BjFsFz9lg/yDj0U7JbslFpZQyBP2a83khoiLiWPA/h/OVGOk+GwnJ5y1iyRS5Im1VLm18cKOc+CYrlGjnxUuZPIOlAn0yWdNXdlrMyRE7LM00eBjBT7niFVTvHsKJ8k6sw1yC4ZIl0EUMOcRT/X44v14xEZSBWfk+d8NpzKujgPGiYrOXI+XTGeGtjpewtjm16Qh3JT3sgvickfNo4yF6V4PVyE2wQUZvP7FmmIa/iDIpwkHRPkrC2iEIlhEZ2mtarIsz3sOoX0PPrP7nAWPRYjj51E85JiJEYO0VsfR5hL5wZal3T7aZl10kLiEyNEHtOSbt4g/gaduRjzC+S9RwtZ332XBxQpzGZ+p72SR5BumUYHLaaDSiySUXKPig6Wj+SmjX5s4BQB0pFBQVo4dhenspfKC1kaYLKVa9pOAW5Q2Ww2qeU92kHbzZRDvK2sBSfLDLtNUp/82rOj7nDm9tJi7lhoeWNzG7Pkqxz8R5p8ByhcGVd0CzkOOWv28KBJvNGa+V2/Y5U08vQm8mgvmTNyjpxHSFUj6/9rZPKerGSTuCPCi7qIdX3GXwEGAPFYt+/OgAXDAAAAAElFTkSuQmCC";

//papaya.ui.Toolbar.ICON_EXPAND =   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAE00lEQVR42u2djW3UQBCFJx3QAemAdJBQAVABTgekAqCC0EGOCoAKWDqADkIHKQGPfKdEh3Nr7493Z977pJWQwtk7+77ETs6zdyYEmrPWEyBtoQDgUABwKAA4FAAcCgAOBQCHAoBDAcChAOBQAHAoADgUABwKAE6uALfjuGg094dx7Mbxo9H5D7wZxzCOF43O/3scN6kvzhXg5ziuGhV+4K20k0DD/964/jCO16kv9iCABvCu0bm/ySRgS4KAC7Abx3Wjc9/J9OO/JUGABXjYn/9Po/O/kimAVtd/EQMC6E1Krevkbhx/Kx17KSpBrcuAHjd2kx2kcwGUYRxfy60LBO9lEjxGEAMCKINQgqUsDV8JYkQAZRBKEGNN+EqQzgTQa/6p69YglOA5YuHPrW2QzgT4NI77SCGDUIJjYuEP4ziXaX2fEqRDAT4vLIgSTCxdq49iSIA1hSGzZo3MCbC2QDTWro1JAVIKRSBlTcwKkFqwV1LXwrQAOYV7ImcNzAuQuwDWya3dhQAlFsIiJWp2I0CpBbFCqVpdCVByYXqmZI3uBCi9QL1RujaXAigeJahRk1sBFE8S1KrFtQCKBwlq1uBeAMWyBLXnDiGAYlGCLeYMI4BiSYKt5golgGJBgi3nCCeA0rMEW88NUgClRwlazKk7AeaaI3WCpQVQepKg1VzmBMhqjs0V4Lg9unavXg8StJzDS5keDX/ai5jVHl9ih5DDBgka/hep36jZMoAeBNRexA8ySaBzydobweoWMS2C6CH84lgVQNkyEJfhK5YFULYIxm34inUBlFhA55K+h8DcTddTBjEcvuJBAOWUBIOkh3Qp0+/ZpY/bDV4EUJ6T4GocvxKP+ZwAgzgIX/EkgKIS6K+ihx/ZQTL+Srbn+K+dgzgJX/EmgKLX7fP9v1O/84+53B8zSPs9iYriUQCyAgoADgUAhwKAQwHAoQDgUABwKAA4FAAcCgAOBQCHAoBDAcChAOB4FEDfDr6Sacfykm8Hy/6YfDu4Y46fCgpS9oEQ7X3QZ/L5QEiH8JGwBLwIcOqh0CtJF6DWw6bd4EGAUyHpj2z9iJWcx8LvT3x9EOMSWBeAjSGZWBaArWEFsCoAm0MLwfZwO+c+0FV7+NwGETk3XTF6CKDlHOY+rLrpBhHcImbbuXS3RQw3idp2Tt1tEsVt4rhNHDeK3HCOUAJYCH/rucIIYCn8LecMIYDF8Leau3sBLIe/RQ2uBfAQfu1a3ArgKfyaNbkUwGP4tWpzJ4Dn8GvU6EoAhPBL1+pGAKTwS9bsQgDE8EvVbl4A5PBLrIFpARj+I6lrYVYAhv8/KWtiUgCG/zxr18acAAw/zpo1MiUAw1/O0rUyI8D9woLII0skOBcDAuhHrFxECmH488QkmFvbIJ0JcIpBGH6MmATHBDEiwCAMfylrJAhiQIBBGP5alkoQpHMB9Lr1PX6oJPS4tXsRY+geAkOlY2vX1UXk/wTpXICa1P6w6hhzvXpbo+eHFUDZjeO60bnvpN53/1KCgAuQ1RyZyVxz7NYEARcgqz06k+P2+BYEaSjArcRvUmqh1/+dtAv/wGGDjFb3AXqTfZP6YqtbxJBCUABwKAA4FAAcCgAOBQCHAoBDAcChAOBQAHAoADgUABwKAA4FAIcCgPMPvdAfn3qMP2kAAAAASUVORK5CYII=";
//papaya.ui.Toolbar.ICON_COLLAPSE = "data:image/png;base64,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";


//papaya.ui.Toolbar.MENU_DATA = {
//   "menus": [
//      {"label": "File", "icons": null,
//            "items": [
//                {"label": "Add Image...", "action": "OpenImage", "type": "button"},
//                {"type": "spacer"},
//                {"type": "spacer"},
//                {"label": "Close All", "action": "CloseAllImages"}
//            ]
//            },
//        {"label": "Options", "icons": null,
//            "items": [
//                {"label": "Preferences", "action": "Preferences"}
//            ]
//            },
//        {"label": "", "icons": null, "titleBar": "true" },
//        {"label": "EXPAND", "icons": [papaya.ui.Toolbar.ICON_EXPAND, papaya.ui.Toolbar.ICON_COLLAPSE], "items": [], "method": "isCollapsable", "required": "isExpandable" },
//        {"label": "SPACE", "icons": [papaya.ui.Toolbar.ICON_IMAGESPACE, papaya.ui.Toolbar.ICON_WORLDSPACE], "items": [], "method": "isWorldMode", "menuOnHover": true }
//    ]
//};

//papaya.ui.Toolbar.OVERLAY_IMAGE_MENU_DATA = {
//    "items": [
//        {"label": "Image Info", "action": "ImageInfo"},
//       {"label": "DisplayRange", "action": "ChangeRange", "type": "displayrange", "method": "getRange"},
//        {"label": "Transparency", "action": "ChangeAlpha", "type": "range", "method": "getAlpha"},
//        {"label": "Color Table...", "action": "ColorTable", "items": [] },
//        {"label": "Open in Mango", "action": "OpenInMango", "required" : "canOpenInMango" }
//    ]
//};

//papaya.ui.Toolbar.BASE_IMAGE_MENU_DATA = {
//    "items": [
//        {"label": "Image Info", "action": "ImageInfo"},
//        {"label": "DisplayRange", "action": "ChangeRange", "type": "displayrange", "method": "getRange"},
//        papaya.ui.Toolbar.OVERLAY_IMAGE_MENU_DATA.items[3],
//        {"label": "Open in Mango", "action": "OpenInMango", "required" : "canOpenInMango"  }
//    ]
//};

//papaya.ui.Toolbar.PREFERENCES_DATA = {
//    "items": [
//        {"label": "Coordinate display of:", "field": "atlasLocks", "options": ["Mouse", "Crosshairs"]},
//        {"label": "Show crosshairs:", "field": "showCrosshairs", "options": ["All", "Main", "Lower", "None"]},
//        {"label": "Show orientation:", "field": "showOrientation", "options": ["Yes", "No"]},
//        {"label": "Scroll wheel behavior:", "field": "scrollBehavior", "options": ["Zoom", "Increment Slice"], "disabled": "container.disableScrollWheel"},
//        {"label": "Smooth display:", "field": "smoothDisplay", "options": ["Yes", "No"]}

//    ]
//};

//papaya.ui.Toolbar.IMAGE_INFO_DATA = {
//    "items": [
//        {"label": "Filename:", "field": "getFilename", "readonly": "true"},
//        {"label": "File Length:", "field": "getFileLength", "readonly": "true"},
//        {"spacer": "true"},
//        {"label": "Image Dims:", "field": "getImageDimensionsDescription", "readonly": "true"},
//        {"label": "Voxel Dims:", "field": "getVoxelDimensionsDescription", "readonly": "true"},
//        {"spacer": "true"},
//        {"label": "Byte Type:", "field": "getByteTypeDescription", "readonly": "true"},
//        {"label": "Byte Order:", "field": "getByteOrderDescription", "readonly": "true"},
//        {"label": "Compressed:", "field": "getCompressedDescription", "readonly": "true"},
//        {"spacer": "true"},
//        {"label": "Orientation:", "field": "getOrientationDescription", "readonly": "true"},
//        {"spacer": "true"},
//        {"label": "Notes:", "field": "getImageDescription", "readonly": "true"}
//    ]
//};



//papaya.ui.Toolbar.SERIES_INFO_DATA = {
//    "items": [
//        {"label": "Filename:", "field": "getFilename", "readonly": "true"},
//        {"label": "File Length:", "field": "getFileLength", "readonly": "true"},
//        {"spacer": "true"},
//        {"label": "Image Dims:", "field": "getImageDimensionsDescription", "readonly": "true"},
//        {"label": "Voxel Dims:", "field": "getVoxelDimensionsDescription", "readonly": "true"},
//        {"label": "Series Points:", "field": "getSeriesDimensionsDescription", "readonly": "true"},
//        {"label": "Series Point Size:", "field": "getSeriesSizeDescription", "readonly": "true"},
//        {"spacer": "true"},
//        {"label": "Byte Type:", "field": "getByteTypeDescription", "readonly": "true"},
//        {"label": "Byte Order:", "field": "getByteOrderDescription", "readonly": "true"},
//        {"label": "Compressed:", "field": "getCompressedDescription", "readonly": "true"},
//        {"spacer": "true"},
//        {"label": "Orientation:", "field": "getOrientationDescription", "readonly": "true"},
//        {"label": "Notes:", "field": "getImageDescription", "readonly": "true"}
//    ]
//};

// VANESSA STOPPED HERE - NOW FIGURE OUT HOW TOOLBAR GETS RENDERED< DO SAME FOR A NEW OVERLAY LAYER
papaya.ui.Overlay.prototype.buildOverlay = function () {
    var ctr;

    this.imageMenus = null;
    this.spaceMenu = null;

    this.container.titlebarHtml = this.container.containerHtml.find("." + PAPAYA_TITLEBAR_CSS);
};