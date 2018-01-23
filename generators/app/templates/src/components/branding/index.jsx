import React from 'react';
import styles from '../index.scss';

export default function Branding() {
    return (
        <div className={styles.branding}>
            Powered by
            <img src="https://s3.app-arena.com/website/images/logo.svg" alt="App-Arena Logo"/>
        </div>
    );
}