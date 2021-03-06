/* eslint-disable no-trailing-spaces */

import React, { Component } from 'react';
import {
    TextInput,
    View,
    Text,
    Platform,
    LayoutAnimation,
    TouchableOpacity,
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
} from 'react-native';

import styles from './styles';

/* Types ==================================================================== */

interface Props {
    testID?: string;
    codeLength: number;
    autoFocus?: boolean;
    obfuscation?: boolean;
    onFinish?: (code: string) => void;
    onEdit?: (pin: string) => void;
}

interface State {
    code: string;
}
/* Component ==================================================================== */
class PinInput extends Component<Props, State> {
    private textInput: TextInput = undefined;

    constructor(props: Props) {
        super(props);

        this.state = {
            code: '',
        };

        this.clean = this.clean.bind(this);
        this.focus = this.focus.bind(this);
        this.blur = this.blur.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    public static defaultProps = {
        codeLength: 4,
        autoFocus: true,
    };

    public blur() {
        this.textInput.blur();
    }

    public focus() {
        this.textInput.focus();
    }

    public clean() {
        this.setState({
            code: '',
        });
    }

    setPinCode(newCode: string) {
        const { onEdit } = this.props;

        if (onEdit) {
            onEdit(newCode);
        }

        LayoutAnimation.easeInEaseOut();

        this.setState({
            code: newCode,
        });
    }

    onKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>) {
        const { code } = this.state;
        if (e.nativeEvent.key === 'Backspace' && Platform.OS === 'android') {
            const arrayCode = code.split('');
            arrayCode.pop();
            this.setPinCode(arrayCode.join(''));
        }
    }

    handleEdit(code: string) {
        const { codeLength, onFinish } = this.props;

        this.setPinCode(code);

        // User filling the last pin ?
        if (code.length === codeLength) {
            this.textInput.blur();

            if (onFinish) {
                onFinish(code);
            }
        }
    }

    render() {
        const { obfuscation, codeLength, autoFocus, testID } = this.props;
        const { code } = this.state;

        const pins = [];
        for (let index = 0; index < codeLength; index++) {
            const id = index;
            const value = code[id] ? (obfuscation ? '•' : code[id].toString()) : '';

            pins.push(
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                        this.textInput.focus();
                    }}
                    key={id + value}
                    style={[styles.pinInput, code.length === id && styles.pinInputActive]}
                >
                    {value ? (
                        <Text adjustsFontSizeToFit style={styles.pinText}>
                            {value}
                        </Text>
                    ) : null}
                </TouchableOpacity>,
            );
        }

        let props = {};

        // ios
        if (Platform.OS === 'ios') {
            props = { display: 'none' };
        } else {
            // android
            props = { style: styles.hiddenInput };
        }

        return (
            <View style={[styles.container]}>
                <TextInput
                    ref={r => {
                        this.textInput = r;
                    }}
                    testID={testID}
                    keyboardType="number-pad"
                    onKeyPress={this.onKeyPress}
                    onChangeText={this.handleEdit}
                    maxLength={codeLength}
                    returnKeyType="done"
                    autoFocus={autoFocus}
                    value={code}
                    // eslint-disable-next-line
                    {...props}
                />
                <View style={[styles.containerPin]}>{pins}</View>
            </View>
        );
    }
}

export default PinInput;
