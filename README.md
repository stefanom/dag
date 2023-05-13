# Dag

Dag is a tool for thought (tft) that helps you think of dependency maps.

![Dag Screenshot](https://github.com/stefanom/dag/blob/main/images/dag.png?raw=true)

## What are dependency maps?

When working on something with multiple people, it's useful to know what can be
done in parallel and what cannot. If taskA and taskB might be done in parallel, but
both depend on taskC which then needs to be accomplished to unlock the ability
to work on those tasks.

## Why is this useful?

I believe that planning is not about predicting the future but rather to help making optimal decisions under uncertainty. I also believe that while plans are generally
crap and fail to survive contact with reality,  planning is invaluable.

Dag is designed to help you articulate visually what it would be very slow and
cumbersom to draw in either drawing programs or in rectangular editing substrates
like spreadsheets.

## How do I install it?

Clone this git repo, make sure you have `python` and `pip` installed and then run:

> pip install -r requirements.txt

## How do I run it?

Run it with

> ./dag.py

then point your browser to http://127.0.0.1:8080/ to interact with it.

## How do I use it?

The dependency map is drawn link by link, in the format of

> taskA > taskB

which is used to indicate that `taskA` needs `taskB`, that is, `taskA` cannot be
executed until `taskB` has been completed.

The Sankey diagram is redrawn for every change you make to the text, so you just
type away and the diagram responds.

The name of the task is also its index, so make sure you use the very same name
if you want two tasks to be considered the very same and connect in the chart.

## How do I save my dependency maps?

Dag doesn't do it for you (at least at this time) You save it anywhere you normally keep notes or documentation or whatever.

## Can I help?

Absolutely, send me a PR or submit a feature request.
