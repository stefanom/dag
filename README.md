# Dag

Dag is a tool for thought (tft) that helps you think of dependency maps.

![Dag Screenshot](https://github.com/stefanom/dag/blob/main/images/dag.png?raw=true)

## What are dependency maps?

When working on something with multiple people, it's useful to know what can be
done in parallel and what cannot. If we have three tasks TaskA, TaskB and TaskC, can
we assign them to different people at the same time, or is one blocked by another?
How long is each task going to take? How confident are we about those ETAs? How
much uncertainty are we hidding in those plans? which tasks should be done first?
Are there ways to refactor the work to reduce risk and uncertainty? How do we know
are mapping our opportunity and risk management space optimally with our plan
of action?

## Why is this useful?

I believe that planning is not about predicting the future but rather a support
system to help making better decisions under uncertainty. I also believe that planning
tools focus too much on the "artifacts" (the plan itself) which is generally crap
and don't focus enough on the value of act of planning itself.

Dag is designed to help you articulate visually what it would be very slow and
cumbersom to draw in either drawing programs or in rectangular editing substrates
like spreadsheets or on whiteboards.

We tend to avoid continuous planning because the ROI is poor and I feel that this
is because planning tools are designed to be "asset generators" (as a way for
producers, project or product managers to talk about "the plan" with others) but
instead they should be considered "tools to amplify thought" and encouradge
exploration, tweaking and continuous updating by everyone involved in a project.

## How do I use it?

TODO: point to the Github Hosted static page when it's available

The dependency map is drawn link by link, in the format of

> * taskA > taskB [effort|uncertainty]

which is used to indicate that `taskA` needs `taskB`. That is: `taskA` cannot be
completed until `taskB` has been completed.

The `[]` part is metadata about `taskB` and it's optional. If you include it must
contain at least the amount of effort (as an integer). Up to you to decide what
kind of metric system to use for effort, Dag doesn't care. Optionally, you can
provide a measure of how certain you are of such an effort evaluation. Dag calls it
`uncertainty` and it's used internally to pad the effort to account for worst-case
scenarios. This number can be a floating point number and the `mass` of a task
is calculated as

> mass = effort + effort * uncertainty

So, [2|0.5] will lead to a task of mass 3 = (2 + 2*0.5). This is equivalent to
saying "I'm only 50% confident of 2 units of effort for this task".

The Sankey diagram is redrawn for every change you make to the text, so you just
type away and the diagram responds.

The name of the task is also its index, so make sure you use the very same name
if you want two tasks to be considered the very same and connect in the chart.

## How do I save my dependency maps?

Dag doesn't do it for you (at least at this time). You save it anywhere you normally keep notes or documentation or whatever.

## How do I run it locally?

Make sure you have `node.js` installed, then type:

> npm run dev

which will automatically open your browser to the right page. If you
make any changes in the `./dev` folder the page reload automagically.

## How do I package it for release?

Make sure you have `node.js` installed, then type:

> npm run release

## Can I help?

Absolutely, send me a PR or submit a feature request.

## What's left to be done?

* show the difference between mass given to effort vs. mass given to uncertainty
* highlight the critical path
