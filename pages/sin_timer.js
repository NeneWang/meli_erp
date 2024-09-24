import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Quiz from '../components/Quiz_no_timer';
import React, { useState, useEffect } from 'react';

// import nails.json from public/nails.json

import nails from '../public/nails.json';
import beauty from '../public/beauty.json';

export default function Home() {

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [nailsIdx, setNailsIdx] = useState(0);
  const [beautyIdx, setBeautyIdx] = useState(0);


  const [question_sample_beauty, setQuestionSampleBeauty] = useState([]);
  const [question_sample_nails, setQuestionSampleNails] = useState([]);

  let confetti_beauty = ['🪞', '💄', '💋', '💄', '🧴'];
  let confetti_nails = ['💅🏻', '💅🏻', '💅🏻', '🎀༘', '💕'];


  useEffect(() => {
    // randomize questions order.



    // randomize the order of the questions options:
    const shuffle = (array) => {
      let currentIndex = array.length, randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      // add print label as a, b, c
      array.forEach((item, index) => {
        item.print_label = String.fromCharCode(97 + index);
      });
      return array;
    }


    nails.forEach((question) => {
      question.options = shuffle(question.options);
    })

    beauty.forEach((question) => {
      question.options = shuffle(question.options);
    }
    )

    nails.sort(() => Math.random() - 0.5);
    beauty.sort(() => Math.random() - 0.5);


    setQuestionSampleBeauty(beauty);
    setQuestionSampleNails(nails);
    // console.log('initiated with nails', question_sample_nails.length, 'beauty', question_sample_beauty.length);
  }, []);

  const selectCategoryClick = (category, increase = true, is_correct = true) => {
    let nailsIdxNew = nailsIdx;
    let beautyIdxNew = beautyIdx;

    if (increase) {
      if (category == 'nails') {
        nailsIdxNew = nailsIdx + 1;
        if (nailsIdxNew > question_sample_nails.length - 1) {
          nailsIdxNew = 0;
        }


      } else if (category == 'beauty') {
        beautyIdxNew = beautyIdx + 1;
        if (beautyIdxNew > question_sample_beauty.length - 1) {
          beautyIdxNew = 0;
        }
      }

      setBeautyIdx(beautyIdxNew);
      setNailsIdx(nailsIdxNew);
    }


    setSelectedCategory(category);


  }


  return (
    <div className={styles.container}>
      <Head>
        <title>Mely Quiz</title>
        <link rel="icon" href="/isologo-negro.ico" />
        <link rel="stylesheet" href="https://use.typekit.net/pnw6ueg.css"></link>
      </Head>
      <div className="logo">
        <img src="mely_icono.png" alt="" />
      </div>
      <br />

      <main>

        <div>
          {
            selectedCategory == 'nails' && (
              <Quiz QuestionSet={question_sample_nails} selectCategory={selectCategoryClick} defaultIndex={nailsIdx} confetti_celebration={confetti_nails} ></Quiz>
            )
          }
          {
            selectedCategory == 'beauty' && (
              <Quiz QuestionSet={question_sample_beauty} selectCategory={selectCategoryClick} defaultIndex={beautyIdx} confetti_celebration={confetti_beauty} ></Quiz>
            )
          }

          {selectedCategory == null && (
            <div>
              <div className="quiz-container">
                <br />
                <button className='redirect-button option' onClick={() => selectCategoryClick('nails', false)} >Nails</button>
                <button className='redirect-button option' onClick={() => selectCategoryClick('beauty', false)}  >Beauty</button>

              </div>
            </div>
          )}
          <br />
        </div>


      </main>

      <div className="footer">

        <h1>mely.com.ar</h1>
      </div>

    </div>
  );
}
