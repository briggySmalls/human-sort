import React, { useState, ChangeEvent, FormEvent } from 'react';

interface Props {
    onSubmitted: (items: String[]) => void
}

export default function Inputting({ onSubmitted }: Props): JSX.Element {
    const [text, setText] = useState('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmitted(text.split("\n"))
    };

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setText(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea value={text} onChange={handleChange} />
            <button type="submit">Submit</button>
        </form>
    );

}
