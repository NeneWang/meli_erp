import React, { useState, useEffect } from 'react';
import CircleLabel from './CircleLabel';
import JSConfetti from 'js-confetti';
import { useTimer } from 'react-timer-hook';
const SECONDS_TIMER = 15;

const Quiz = ({ QuestionSet, defaultIndex = -1, selectCategory, jsConfetti = new JSConfetti(), confetti_celebration = ['🪞', '🫧', '🎀', '✨', '💫', '🌸', '💄', '💋', '💆🏻‍♀️', '💕', '🧴'] }) => {
    // const [defaultIndex, setIndex] = useState(defaultIndex);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answerSubmitted, setShowResult] = useState(false);
    const [is_answer_correct, setAnswerCorrect] = useState(false);
    const [outOfTime, setOutOfTime] = useState(false);


    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useTimer({
        expiryTimestamp:
            new Date().setSeconds(new Date().getSeconds() + SECONDS_TIMER)
        , onExpire: () => {
            // setAnswerCorrect(false);
            setShowResult(true);
            setOutOfTime(true);
            // console.warn('onExpire called');
        }
    });



    if (defaultIndex === -1 && QuestionSet?.length > 0) {
        const randomIndex = Math.floor(Math.random() * QuestionSet.length);
        setIndex(randomIndex);

    }

    const handleOptionClick = (option) => {
        if (answerSubmitted || !isRunning) {
            return;
        }
        setSelectedOption(option);
        handleSubmit(option);
        if (option === QuestionSet[defaultIndex].answer) {
            setAnswerCorrect(true);
        } else {
            setAnswerCorrect(false);
        }
        pause();
    };

    const handleSubmit = (option) => {
        setShowResult(true);
        const isCorrect = option == QuestionSet[defaultIndex].answer
        // console.log('isCorrect', isCorrect, option, QuestionSet[defaultIndex].answer);
        if (isCorrect && jsConfetti) {

            jsConfetti.addConfetti({
                emojis: confetti_celebration,
            })
            jsConfetti.addConfetti({
                emojis: confetti_celebration,
                confettiNumber: 120,
            })
        }

        setAnswerCorrect(isCorrect);

    };

    const selectCategoryOption = (category) => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + SECONDS_TIMER);
        restart(time);
        // time.setSeconds(time.getSeconds() + 10);

        setSelectedOption(null);
        setShowResult(false);
        setAnswerCorrect(false);
        setOutOfTime(false);

        selectCategory(category);

    }

    if (defaultIndex === -1 || !QuestionSet?.[defaultIndex]) {
        return <div className="loading">Loading...</div>; // Handle case where question set is not ready
    }

    return (
        <div className="quiz-container">
            {/* <div className="quiz-container"></div> */}
            <div className="title-container">
                <h2 className="question-text">{QuestionSet[defaultIndex].question}</h2>

            </div>
            <span style={{ fontSize: '2em' }}>
                <span>{seconds}</span>
            </span>


            {
                !outOfTime && (
                    <div>

                        <div className="options-container">
                            {QuestionSet[defaultIndex].options.map((option) => (

                                <button
                                    onClick={() => handleOptionClick(option.label)}
                                    className={`option-button option ${answerSubmitted && option.label == QuestionSet[defaultIndex].answer ? 'correct_option' : ''} ${selectedOption === option.label ? (option.label != QuestionSet[defaultIndex].answer ? 'incorrect_selected' : '') : ''}`}
                                    key={option.label}
                                >
                                    <CircleLabel is={answerSubmitted ? option.label == QuestionSet[defaultIndex].answer ? 'check' : 'cross' : null} label={option.print_label} /> {option.value}
                                </button>
                            ))}
                        </div>
                    </div>
                )
            }

            {
                outOfTime && (
                    <div>
                        <h2>Tiempo agotado!</h2>
                    </div>
                )
            }




            {answerSubmitted && (
                <div>
                    <br />

                    <button className='redirect-button option' onClick={() => selectCategoryOption('nails')}>Nails</button>
                    <button className='redirect-button option' onClick={() => selectCategoryOption('beauty')} >Beauty</button>
                </div>
            )}

        </div>
    );
};

export default Quiz;
