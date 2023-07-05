# Prompting Approaches

## initial braindump
break down task into different prompts
- take story or description convert into a list of tasks
> Turn this description of a unity c# script into a tasks you can break it down into smaller, actionable steps:  
- take a list of tasks and turn them into code in language X
- take a code and error text return the fixed code
- explain this code block

## formatting code
- fix syntax errors
- add XML code comments to a code block

## here's what I'm currently toying with as of July 3, 2023

Breaking down the process of writing an idea to generated code into smaller intermediary pieces. I have found several times now that I'll be building something by making the AI write the code and it'll work and be getting close to what I need. When the code gets too long, and maybe extends past the size of its context, it falls apart when you add too many features to one script. You'll have something complex that is *almost* working right and then you try one more fix and it breaks something else. So you ask it to fix it and then you have the original problem again. And it seems to be almost getting it but not quite. 

So I'm trying an approach where instead of going from a User Story/Description of the behavior straight to Code. I'll try to include intermediary steps that might help the user consider what the machine plans to write in code before it's turned into code syntax. 

The conversation part still happens in both cases but each machine is told it has different sorts of primary outputs (code, boilerplate, approaches to take, tasks, etc). The user can make queries of the output regarding how it might behave in certain cases and having the output or input be modified if necessary. Such as adding conditions that should be applied to a given task item.

## Prompt ideas
1. Story to tasks
2. Tasks to code
3. Tasks to approaches
4. Story to approaches
5. Approach+Tasks to code
6. Approach+Story to tasks
7. Approach+Code to Code (refactor)

## July 4, 2023
8. Add redundant comments to describe every line of code
