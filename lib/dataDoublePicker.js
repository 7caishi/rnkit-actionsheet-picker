/* @flow */

/**
 * dataPicker.js
 *
 * @author SimMan (liwei0990#gmail.com)
 * @Time at 2016-12-01 15:04:33
 * Copyright 2011-2016 RNKit.io, Inc.
 */
'use strict';

import {
    NativeModules,
    processColor,
    Platform,
    NativeEventEmitter
} from 'react-native';

const {RNKitASDataDoublePicker} = NativeModules;
const nativeEventEmitter = new NativeEventEmitter(RNKitASDataDoublePicker);

let listener = null;

const dataDoublePickerDefaultArgs = {
    titleText: '',
    titleTextColor: '#393939',
    doneText: '确定',
    doneTextColor: '#269ff7',
    cancelText: '取消',
    cancelTextColor: '#269ff7',
    numberOfComponents: 1,
};

let DataDoublePicker = {
    show: (args) => {
        const options = {...dataDoublePickerDefaultArgs, ...args,};
        try {
            RNKitASDataDoublePicker.showWithArgs({
                ...options,
                titleTextColor: processColor(options.titleTextColor),
                doneTextColor: processColor(options.doneTextColor),
                cancelTextColor: processColor(options.cancelTextColor),
                wheelBgColor: processColor(options.wheelBgColor),
                titleBgColor: processColor(options.titleBgColor),
                outTextColor: processColor(options.outTextColor),
                centerTextColor: processColor(options.centerTextColor),
                dividerColor: processColor(options.dividerColor),
                shadeBgColor: processColor(options.shadeBgColor),
            }, (resp) => {
                if (resp.type === 'done') {
                    let selectedData = Platform.OS === 'android' ? resp.selectedData.reverse() : resp.selectedData;
                    let selectedIndex = Platform.OS === 'android' ? resp.selectedIndex.reverse() : resp.selectedIndex;
                    let leftSelectedData = {
                        key: selectedIndex[0],
                        val: selectedData[0]
                    };
                    let rightSelectedData = {
                        key: selectedIndex[1],
                        val: selectedData[1]
                    };
                    options.onPickerConfirm && options.onPickerConfirm(
                        leftSelectedData, rightSelectedData
                    );
                } else {
                    options.onPickerCancel && options.onPickerCancel();
                }
            });
            listener && listener.remove();
            listener = nativeEventEmitter.addListener('DataPickerEvent', event => {
                options.onPickerDidSelect && options.onPickerDidSelect(event.selectedData, event.selectedIndex);
            });
        }
        catch (e) {
            console.log(e);
            listener && listener.remove();
            options.onPickerCancel && options.onPickerCancel();
            return;
        }
    }
};

export default DataDoublePicker;
