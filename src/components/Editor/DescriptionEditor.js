import React, { useRef } from 'react';
import classNames from 'classnames';
import { Button, Tooltip, Icon } from 'antd';
import { Editor, RichUtils } from 'draft-js';
import styles from './DescriptionEditor.less';

const DescriptionEditor = ({ placeholder, editorState, onChange, minCount }) => {
    const editorRef = useRef(null);
    const handleFocus = () => editorRef.current.focus();
    const handleKeyCommand = command => {
        if (command !== 'bold' && command !== 'italic') return 'not-handled';
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            onChange(newState);
            return 'handled';
        }
        return 'not-handled';
    };
    const handleBlock = blockType => e => {
        e.preventDefault();
        onChange(RichUtils.toggleBlockType(editorState, blockType));
    };
    const getBlockType = () => {
        const selectionState = editorState.getSelection();
		return editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey()).getType();
    };
    const blockBtnClass = blockType => {
        if (getBlockType() === blockType) return classNames(styles.btn, styles.btnActive);
        return styles.btn;
    };
    const handleInlineStyle = inlineStyle => e => {
        e.preventDefault();
        onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
    const inlineStyleBtnClass = inlineStyle => {
        const currentInlineStyle = editorState.getCurrentInlineStyle();
        if (currentInlineStyle.has(inlineStyle)) return classNames(styles.btn, styles.btnActive);
        return styles.btn;
    };
    let remainWordsCount;
    if (minCount) {
        const length = editorState.getCurrentContent().getPlainText('').length;
        remainWordsCount = length < minCount ? `(${minCount - length})` : <Icon type="check" />;
    }
    return (
        <div className={styles.descriptionEditor}>
            <div className={styles.buttons}>
                <Tooltip placement="top" title="Bold | Cmd+B">
                    <span className={inlineStyleBtnClass('BOLD')} onMouseDown={handleInlineStyle('BOLD')}><Icon type="bold" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Italic | Cmd+I">
                    <span className={inlineStyleBtnClass('ITALIC')} onMouseDown={handleInlineStyle('ITALIC')}><Icon type="italic" /></span>
                </Tooltip>
                <Tooltip placement="top" title="Numbers list">
                    <span className={blockBtnClass('ordered-list-item')} onMouseDown={handleBlock('ordered-list-item')}>
                        <Icon type="ordered-list" />
                    </span>
                </Tooltip>
                <Tooltip placement="top" title="Bullets list">
                    <span className={blockBtnClass('unordered-list-item')} onMouseDown={handleBlock('unordered-list-item')}>
                        <Icon type="unordered-list" />
                    </span>
                </Tooltip>
                {minCount && (
                    <span className={styles.extra}>
                        {remainWordsCount}
                    </span>
                )}
            </div>
            <div className={styles.editor} onClick={handleFocus}>
                <Editor
                    onChange={onChange}
                    editorState={editorState}
                    placeholder={placeholder}
                    handleKeyCommand={handleKeyCommand}
                    ref={editorRef}
                />
            </div>
        </div>
    );
};

export default DescriptionEditor;