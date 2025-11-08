import React from 'react';
import styles from './DynamicTextRender.module.css'

const DynamicTextRender = React.memo(({ text, setselectedwords }: { text: string, setselectedwords: React.Dispatch<React.SetStateAction<string[]>> }) => {

    function formatText(text: string) {
        const parts = text.split(/(\{.*?\}|\[.*?\])/g);

        return parts.map((part, i) => {
            if (part.startsWith('{') && part.endsWith('}')) {
                return (
                    <span key={i} onClick={()=> setselectedwords(sw => [...sw, part.slice(1, -1).trim()])} className={styles.important}>{part.slice(1, -1)}</span>
                )
            } else if (part.startsWith('[') && part.endsWith(']')) {
                return (
                    <span key={i} className={styles.interesting}>{part.slice(1, -1)}</span>
                )
            }
            return part
        })
    }

    return <div>{formatText(text)}</div>;
}, (prevProps, nextProps) => prevProps.text === nextProps.text);

export default DynamicTextRender;
