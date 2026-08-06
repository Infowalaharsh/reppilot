# Reppilot AI Coach

Project Overview

Build a modern cross-platform web application called Nextrep

This is not just another workout tracker.

The core purpose of the app is to eliminate guesswork from strength training by automatically managing progressive overload, workout tracking, nutrition tracking, and fitness progress.

The app should feel like Apple Fitness + Duolingo + Notion.

Design philosophy:

Ultra minimal

Premium

Fast

Zero clutter

Extremely intuitive

Dark mode first

One-handed usage

Designed for use inside a gym

The primary goal is to answer one question every time a user opens the app:

"What should I do today?"

Target Users

Beginners

Intermediate lifters

Advanced gym-goers

Bodybuilders

Powerlifters

People trying to lose fat

People trying to gain muscle

Core Value Proposition

Most fitness apps only record workouts.

This app actively coaches users through progressive overload.

Instead of asking users to remember previous workouts, calculate increases, or decide what to lift next, the app should automatically generate recommendations.

Example:

Previous workout

Bench Press

60kg

8

8

8

Today

Recommended

62.5kg

6–8 reps

If completed successfully

Next recommendation

65kg

Design System

Theme

Dark Mode

Background

#0D0D0D

Cards

#181818

Primary Accent

Electric Blue (#4F8CFF)

Secondary

Green

Warning

Orange

Error

Red

Typography

Modern

Minimal

Rounded corners

16px

Large spacing

Glassmorphism where appropriate

Animations

Smooth

Apple-like

Micro interactions

Premium loading animations

Progress rings

Haptic feedback

Bottom Navigation

Five tabs

Home

Workout

Nutrition

Progress

Profile

Navigation should remain fixed.

HOME SCREEN

The dashboard should show

Greeting

Workout streak

Today's workout

Calories consumed

Protein intake

Current weight

Recovery score

Weekly progress

Quick Start Workout button

Example layout

Good Morning 👋

🔥 18 Day Streak

Today's Workout

Push Day

START

Calories

1800 / 2500

Protein

102 / 150g

Recovery

82%

Recommended

Increase Bench Press today

Weight

67kg

+1.2kg this month

Recent PR

Bench Press

85kg

WORKOUT TAB

The workout page is the most important screen.

When the user starts a workout

Show

Exercise image

Exercise name

Target weight

Target reps

Previous performance

Rest timer

Set logger

No unnecessary information.

Example

Bench Press

Today's Target

62.5kg

6–8 reps

Last Workout

60kg

8

8

8

Start Set

SET LOGGER

Each exercise contains

Weight

Reps

Completed checkbox

Rest timer

Auto suggestions

Example

Set 1

Weight

62.5

Reps

8

✓

Set 2

62.5

7

✓

Set 3

62.5

6

✓

Complete Exercise

PROGRESSIVE OVERLOAD ENGINE

Automatically determine future workouts.

Rules

If all target reps achieved

Increase weight next session

If only minimum reps achieved

Maintain weight

If user fails significantly

Reduce weight slightly

If plateau detected for several weeks

Suggest deload week

Support

Double Progression

Linear Progression

Percentage Based Progression

Powerlifting Progression

Hypertrophy Progression

Allow user to choose strategy.

REST TIMER

Automatically starts after every completed set.

Options

Skip

Pause

+30 sec

Notification vibration

EXERCISE DATABASE

Include hundreds of exercises.

Each exercise includes

Muscle group

Equipment

Difficulty

Instructions

Animation

Target muscles

Secondary muscles

Common mistakes

Alternative exercises

WORKOUT SPLITS

Support

Push Pull Legs

Upper Lower

Bro Split

Arnold Split

Full Body

Powerlifting

Bodybuilding

Custom split builder

Users can create unlimited workout plans.

AI WORKOUT COACH

Built-in AI trainer.

Example questions

Why am I stuck on bench?

Should I increase weight?

Can I replace barbell rows?

How much protein do I need?

The AI should reference the user's workout history before answering.

NUTRITION TAB

Track

Calories

Protein

Carbs

Fat

Fiber

Water

Meal timing

Include

Breakfast

Lunch

Dinner

Snacks

FOOD SEARCH

Large searchable database.

Support

Indian foods

International foods

Restaurant meals

Barcode scanner

Voice search

Favorites

Recently eaten foods

AI CALORIE ESTIMATION

User uploads food photo.

AI estimates

Calories

Protein

Carbs

Fat

Confidence score

Allow manual correction.

DAILY GOALS

Automatically calculate

Maintenance calories

Fat loss calories

Muscle gain calories

Protein goal

Water goal

Based on

Age

Weight

Height

Gender

Activity level

Goal

PROGRESS TAB

Charts

Weight graph

Body fat graph

Strength graph

Calories graph

Protein graph

Workout consistency

PR timeline

Monthly summaries

BODY MEASUREMENTS

Track

Weight

Chest

Waist

Shoulders

Arms

Forearms

Thighs

Calves

Neck

Body fat %

BMI

PROGRESS PHOTOS

Store

Front

Side

Back

Monthly comparisons

Slider comparison

Private encrypted storage

PERSONAL RECORDS

Automatically detect

Bench PR

Squat PR

Deadlift PR

Military Press

Rows

Pull-ups

Celebrate

Confetti

Badges

Achievements

RECOVERY SCORE

Ask daily

Hours slept

Stress

Soreness

Fatigue

Mood

Calculate

Recovery %

Recommendations

Increase weight

Maintain

Take rest

Deload

NOTIFICATIONS

Workout reminder

Meal reminder

Water reminder

Protein reminder

Weekly report

Streak reminder

Recovery check

GAMIFICATION

Workout streak

XP

Levels

Achievements

Badges

Challenges

Weekly missions

Leaderboards (future)

PROFILE

Personal information

Fitness goal

Current weight

Target weight

Preferred workout split

Preferred progression strategy

Units

Theme

Notifications

Subscription

ONBOARDING

Collect

Age

Height

Weight

Gender

Experience level

Goal

Workout frequency

Gym availability

Equipment

Diet preference

Generate personalized workout and nutrition plans automatically.

SEARCH

Search

Exercises

Foods

Workouts

Articles

Tips

SETTINGS

Metric / Imperial

Dark / Light

Language

Notifications

Privacy

Export Data

Delete Account

PREMIUM FEATURES

AI Coach

Advanced Analytics

Unlimited Workout Plans

Progress Predictions

Cloud Backup

Advanced Nutrition

Wearable Integration

Priority Support

FUTURE FEATURES

Apple Watch

Google Fit

Health Connect

Smartwatch Integration

Wearables

Heart Rate

Sleep Tracking

Coach Dashboard

Trainer Accounts

Social Feed

Gym Groups

Challenges

Live Classes

UX Principles

No clutter

No ads

Maximum three taps to log a set

Everything optimized for one-hand usage

Minimal typing

Large buttons

Large numbers

Fast loading

Premium animations

Accessibility support

Offline mode with sync

Tech Stack (Preferred)

Frontend: Flutter

Backend: Supabase

Authentication: Google, Apple, Email

Database: PostgreSQL

Cloud Storage: Supabase Storage

AI: OpenAI/Gemini

Push Notifications: Firebase

Charts: FL Chart

Payments: Razorpay + Stripe

Final Goal

The app should feel like a premium personal strength coach, not just a logging tool. Every interaction should reduce cognitive load and help users make better training decisions. Prioritize simplicity, speed, and actionable recommendations over feature bloat.

💡 One suggestion that could make this a category-defining app

Most fitness apps focus on logging. Your app should focus on predicting.

Imagine a home screen that says:

Today's Readiness: 91%

Bench Press: Increase to 65 kg

Protein Remaining: 42 g

Estimated Goal Date (70 kg bodyweight): 18 October

Workout Duration: 58 minutes

The app should feel like a fitness operating system that tells users exactly what to do next, rather than a notebook where they manually record everything. That positioning is much stronger than competing on the number of features alone.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://reppilot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/619ef9c1-4a9d-44c5-a100-8033f62ab120).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
