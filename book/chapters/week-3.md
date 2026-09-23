---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 3: Lists and loops

Last week, you used calculations and decisions to check individual measurements. But what if you have twenty measurements, or a DNA sequence with thousands of bases? Writing a new statement for every value would quickly become difficult to manage. This week, you will store values together in **lists** and use **loops** to repeat your instructions.

Keep VS Code open as you read. Run each example, change a value, and predict the new result before running it again. Pay particular attention to which lines repeat and which run only once. That distinction is the key to understanding loops.

## Set up your Week 3 folder

Create `week-3` inside `LIFE733`, alongside your folders for Weeks 1 and 2. In VS Code, choose **File → Open Folder** and open `week-3`. Create `practice.py` for experiments, then create a separate file as you reach each question.

By the end of the chapter, your work will be organised like this:

```text
LIFE733/
├── week-1/          ← Your Week 1 scripts
├── week-2/          ← Your Week 2 scripts
└── week-3/          ← Open this folder in VS Code
    ├── practice.py  ← Worked examples and experiments
    ├── q1.py        ← Sum a list
    ├── q2.py        ← Calculate an average
    ├── q3.py        ← Find the maximum
    ├── q4.py        ← Even or odd
    ├── q5.py        ← Count DNA bases
    ├── q6.py        ← Reverse a list
    ├── q7.py        ← Multiplication table
    ├── q8.py        ← Guessing game
    ├── q9.py        ← Mystery message
    └── q10.py       ← Debugging challenge
```

This is a folder diagram, not a command. Keep your earlier work in its existing folders so it is easy to return to.

## Keep related values in a list

A **list** holds items in order. Write square brackets around the items and separate them with commas. In this example, each item is a cell count from a different sample:

```{code-cell} python
counts = [4, 8, 6, 10]          # Four measurements, kept in order.
print(counts)                   # Display the whole list.
print("First:", counts[0])     # Index 0 selects the first item.
print("Last:", counts[-1])     # Index -1 selects the last item.
print("Samples:", len(counts)) # Count items, not characters or their sum.
```

The first item is `4`, the last is `10`, and there are four samples. As with strings in Week 1, indexing starts at zero. Square brackets create a list when they enclose values. After a variable name, as in `counts[0]`, they select an item.

`len(counts)` returns the number of items. It is a function, so write `len(counts)`, not `counts.len()`. The last nonnegative index in a list of four items is `3`. Asking for `counts[4]` raises `IndexError` because that item does not exist.

**Try it:** change the first count to `12` and add a fifth measurement to the list. Predict the first item, last item, and length, then run the code.

### Select part of a list and change an item

List slices use the same start-inclusive, stop-exclusive rule as string slices:

```{code-cell} python
counts = [4, 8, 6, 10]      # Begin with a fresh list for this example.
first_two = counts[:2]      # Copy items at indices 0 and 1.
counts[0] = 5              # Replace the first item in the original list.
print("First two:", first_two)
print("Updated counts:", counts)
```

The slice produces `[4, 8]`. Updating `counts[0]` changes `counts` to `[5, 8, 6, 10]`. The sliced list still contains `4`, because it is a separate list of these numeric values. Lists are **mutable**: you can change their items after creating them. Strings do not allow this kind of item assignment.

**Try it:** use `counts[1:3]` to select the middle two items. Before running, write down which indices are included.

You could add measurements with `counts[0] + counts[1]` and so on, but that expression would need editing whenever the list grew. A loop lets the same instructions work for every item.

## Visit each item with a `for` loop

Loops are a core idea across programming languages. They let you write an instruction once and repeat it for many items, saving you from copying code for every measurement or DNA base. The same loop can process a handful of values or thousands, applying the same steps consistently. In Python, a `for` loop visits each item in a collection in turn.

```{code-cell} python
volumes = [2.0, 3.5, 4.0]       # Volumes in mL for three samples.
for volume in volumes:          # Give volume the next item on each pass.
    print("Processing:", volume)
print("All samples processed.") # Run this once, after the loop finishes.
```

The loop prints one processing message for each value: `2.0`, `3.5`, then `4.0`. Finally, it prints `All samples processed.` once.

Read `for volume in volumes:` as “for each item in `volumes`, call the current item `volume` and run the indented instructions”. `volume` is a variable name you choose. The colon starts the block, and the four spaces show which lines belong to it. One pass through that block is called an **iteration**.

**Try it:** add another volume. You should get another processing message without changing the loop itself. Then indent the final `print` so it is inside the loop, run the script, and explain why the message now repeats. Move it back afterwards.

Printing each value is useful for checking what a loop visits. Next, keep a running total so the loop produces one result from all the values.

### Build a running total

```{code-cell} python
volumes = [2.0, 3.5, 4.0]       # Values to add together.
total = 0.0                    # Set up the total before the loop.
for volume in volumes:
    total = total + volume     # Add the current volume to the previous total.
    print("Running total:", total)  # Show how the value changes each time.
print("Final total:", total)   # Report the result after every item is included.
```

The running totals are `2.0`, `5.5`, and `9.5`. On the assignment line, Python first reads the old value of `total`, adds `volume`, then stores the result back in `total`. A variable used this way is sometimes called an **accumulator**.

Set the starting value before the loop. If you put `total = 0.0` inside the loop, it resets on every pass and loses the earlier additions. You can write `total += volume` as a shorter form of `total = total + volume` when adding these numbers. The order of `+` and `=` matters.

**Try it:** add a volume of `1.5`. The final total should become `11.0`. Use the running totals to check that every value was added once.

### Question 1 — Sum a List

Create `q1.py` with the list `[3, 7, 2, 9, 5]`. Use a `for` loop to add the numbers and print `Total: 26`. For this exercise, build the total yourself rather than using Python's `sum` function.

Test your loop with `[1, 2, 3]` too. It should give `6`. Keep the final output outside the loop. Try the question before watching its walkthrough.

<iframe title="Question 1 walkthrough: sum a list" width="560" height="315" src="https://www.youtube-nocookie.com/embed/2Ypp0C9OjeQ" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You now have a total. An average needs one more piece of information: how many values contributed to it.

## Calculate a result from the whole list

The arithmetic mean is the total divided by the number of values. Calculate it after the loop has finished:

```{code-cell} python
readings = [6.0, 9.0, 12.0]    # Three example measurements.
total = 0.0
for reading in readings:
    total += reading           # Accumulate all three readings.
if len(readings) > 0:           # Check that a mean can be calculated.
    mean = total / len(readings)
    print("Mean:", mean)
else:
    print("No readings to average.")
```

The total is `27.0`, so the mean is `9.0`. The `if` statement is aligned with `for`, which puts it after the loop. Its own indented block runs only if the list contains at least one item. An empty list is written `[]`. Its length is zero, so dividing by its length would fail.

**Try it:** change `readings` to `[]`. The loop performs no iterations and the script prints `No readings to average.`. Then restore the list and add `15.0`. The mean should become `10.5`.

### Question 2 — Average of Numbers

Create `q2.py` by copying your Question 1 script. Keep its loop, then calculate and print the average after the total is complete. For `[3, 7, 2, 9, 5]`, expect `Total: 26` and `Mean: 5.2`.

Check the list length before dividing so an empty list gives `No numbers to average.`. Test a single-item list such as `[8]`: its mean should be `8.0`. Then compare your approach with the walkthrough.

<iframe title="Question 2 walkthrough: average of numbers" width="560" height="315" src="https://www.youtube-nocookie.com/embed/1sTOffTrfoo" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

So far, you have typed the data directly into your script. Next, build a list from responses entered by the person running it.

## Collect input into a list

### Add an item with `append`

```{code-cell} python
readings = []                 # Start with an empty list.
readings.append(4.5)          # Add one value at the end.
readings.append(7.0)          # Add another value after the first.
print(readings)
print("Largest:", max(readings))  # Find the largest item in this nonempty list.
```

The list becomes `[4.5, 7.0]`, and the largest value is `7.0`. `.append(value)` changes the existing list. You do not need to assign its result. Avoid `readings = readings.append(4.5)`: the method returns `None`, so that assignment would replace your list with `None`.

`max(readings)` finds the largest item. `min(readings)` finds the smallest. Both need at least one item when used this way. These are functions, like `len`, so the list goes inside their parentheses.

**Try it:** append `-2.0` and print the list, minimum, and maximum. The list length should become three, the minimum should be `-2.0`, and the maximum should remain `7.0`.

### Repeat a fixed number of times with `range`

When collecting input, you may know how many answers you need before you have any values to loop over. `range` provides a sequence of integers for that purpose:

```python
readings = []                         # Store the responses as numbers.
for sample_number in range(1, 4):      # Visit 1, 2, and 3; stop before 4.
    text = input(f"Reading {sample_number}: ")  # Ask once on each iteration.
    reading = float(text)             # Convert each response before storing it.
    readings.append(reading)
print("Readings:", readings)          # Display the completed list once.
```

Save this example in `practice.py` and run it in the terminal. It asks for three readings. `range(1, 4)` starts at `1` and stops before `4`, so `sample_number` takes the values `1`, `2`, and `3`. For responses `4`, `8`, and `6`, the final list is `[4.0, 8.0, 6.0]`.

`range(3)` also gives three iterations, but starts at zero: `0`, `1`, `2`. Use the two-argument form when you want the prompt numbering to begin at one. Enter valid numeric text for these exercises. Handling conversion errors can come later.

**Try it:** collect four readings instead. Decide what the stop value must be before editing the code. Check that you get exactly four prompts and four list items.

### Question 3 — Find the Maximum

Create `q3.py`. Ask for five numbers using `input` inside a loop. Convert each response to `float`, append it to a list, and print the largest value after all five have been collected. You may use `max` on the completed list.

Test inputs `2`, `9`, `4`, `1`, `7`. Expect `Largest: 9.0`. Then test `-8`, `-3`, `-12`, `-5`, `-9`. Expect `Largest: -3.0`. This second test catches the mistake of assuming the maximum starts at zero. Watch the walkthrough after your own attempt.

<iframe title="Question 3 walkthrough: find the maximum" width="560" height="315" src="https://www.youtube-nocookie.com/embed/AJqHT-ch-Nk" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You collected a whole list before reporting its maximum. Sometimes you can respond to each value straight away. Put a decision inside the loop to check values as they arrive.

## Make a decision on each iteration

```{code-cell} python
readings = [37.0, 39.0, 36.5]   # Example temperatures in degrees Celsius.
for temperature in readings:
    if temperature > 38:       # Check the current reading, not the whole list.
        print(temperature, "is above the threshold")
    else:
        print(temperature, "is not above the threshold")
```

Python finishes the `if`/`else` decision for one temperature before moving to the next. The `if` and `else` lines are four spaces inside the loop. Their `print` lines are a further four spaces inside the branches. Both `37.0` and `36.5` take the `else` branch, while `39.0` takes the `if` branch.

**Try it:** add `38.0` to the list. Predict which message it receives. The comparison is strictly greater than 38, so a value equal to 38 does not pass it.

### Question 4 — Even or Odd

Create `q4.py`. Ask for five integers, one at a time. For each response, immediately print whether it is even or odd. Use the Week 2 test `number % 2 == 0` inside your loop. You do not need to store the responses for this task.

For inputs `7`, `8`, `0`, `-3`, and `-2`, expect odd, even, even, odd, and even respectively. Include the number in each message, such as `7 is odd`. Check that the script asks exactly five times, then watch the walkthrough.

<iframe title="Question 4 walkthrough: even or odd in a loop" width="560" height="315" src="https://www.youtube-nocookie.com/embed/2fuG4Jvev2c" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

The same pattern works on text. A loop over a string visits its characters one at a time, which lets you apply a decision to every DNA base.

## Count items that match a condition

A total adds values together. A counter adds one whenever an item meets a condition:

```{code-cell} python
dna = "aGgTc".upper()       # Normalise case before comparing bases.
g_count = 0                # Start the counter before the loop.
for base in dna:
    if base == "G":        # Only matching bases increase the count.
        g_count += 1
print("G bases:", g_count)
```

The output is `G bases: 2`. `base` takes one character at a time, and only the two `G` characters enter the indented counting statement. `g_count += 1` means add one to the current count.

**Try it:** remove both `G` characters, then try an empty string. Both should give zero. A loop over an empty string runs zero times, leaving the counter at its starting value.

### Question 5 — DNA Base Count

Create `q5.py`. Ask for DNA text and convert it to uppercase. Set up four counters for A, T, C, and G before the loop. Visit each character and use an `if`/`elif` chain to increase the matching counter. Print all four totals after the loop.

For `aCgTtG`, expect A: 1, T: 2, C: 1, G: 2. Use a fifth counter for unexpected characters and report it too. For `ATNX`, expect A: 1, T: 1, C: 0, G: 0, and Unexpected: 2. Spaces also count as unexpected characters under this rule.

Check that the four base counts plus the unexpected count equal the input length. An empty input should produce five zero counts. Use a loop for the counting practice rather than calling the string's `count` method. Then watch the walkthrough.

<iframe title="Question 5 walkthrough: DNA base counting" width="560" height="315" src="https://www.youtube-nocookie.com/embed/4DBaucGZYPk" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Your loops have visited items in their original order. Next, choose a different order without changing the stored list.

## Choose which positions a loop visits

`range` can take three arguments: `range(start, stop, step)`. The stop is always excluded. A negative step counts backwards:

```{code-cell} python
samples = ["alpha", "beta", "gamma"]
for index in range(len(samples) - 1, -1, -1):  # Visit indices 2, 1, then 0.
    print(index, samples[index])              # Select the item at this position.
print("Original:", samples)                  # The stored list is unchanged.
```

`len(samples) - 1` gives the last valid index, `2`. The stop value is `-1`, which is excluded, so the loop still visits index `0`. The final `-1` is the step. The output order is gamma, beta, alpha, while the original list remains in its original order.

You could also loop over `samples[::-1]`, a reversed slice. That creates a new list to visit. Both approaches preserve the original list. The index version gives you practice reading `range` arguments.

**Try it:** add a fourth sample and rerun without changing the loop. Then set `samples` to `[]`. There should be no item output and no indexing error.

### Question 6 — Reverse a List

Create `q6.py` with `["cat", "dog", "rabbit", "tiger"]`. Use a loop to print the words in reverse order, one per line: tiger, rabbit, dog, cat. Keep each word's letters in their original order.

Do not use `list.reverse()`. Use either backwards indices or a reversed slice with a loop. Print the original list afterwards to check that it is unchanged. Try the question before watching its walkthrough.

<iframe title="Question 6 walkthrough: reverse a list" width="560" height="315" src="https://www.youtube-nocookie.com/embed/e0k5wEjU8k8" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A `range` value can be useful in its own right, too. You do not always need to use it as a list index. In the next task, each value becomes part of a calculation.

### Question 7 — Multiplication Table

Create `q7.py`. Ask for an integer, then print its multiplication table from 1 through 10. Use `range(1, 11)` so that 10 is included. Inside the loop, multiply the entered number by the current multiplier and display both inputs and their product with an f-string.

For input `5`, the first line should be `5 x 1 = 5` and the last `5 x 10 = 50`, with ten lines in total. Test `0` and `-2` as well. Then compare your script with the walkthrough.

<iframe title="Question 7 walkthrough: multiplication table" width="560" height="315" src="https://www.youtube-nocookie.com/embed/R2Jwd32wgL8" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

These `for` loops had a collection or range ready to visit. A guessing game is different: you do not know how many attempts someone will need. A `while` loop repeats until its condition becomes false.

## Repeat while a condition holds

```{code-cell} python
remaining = 3                    # Begin with three steps to report.
while remaining > 0:             # Test before every pass through the loop.
    print("Remaining:", remaining)
    remaining -= 1               # Subtract one so the condition can become false.
print("Finished.")               # Run after remaining reaches zero.
```

The output counts down `3`, `2`, `1`, then prints `Finished.`. `remaining -= 1` is shorthand for `remaining = remaining - 1`. After each pass, Python checks `remaining > 0` again. When `remaining` is zero, it skips the block and continues after it.

**Try it:** start with `remaining = 1`, then `remaining = 0`. The second run should print only `Finished.` because the condition is checked before the first iteration.

Before running any `while` loop, identify what changes its condition. If nothing changes, it may run forever. Press **Ctrl+C** in the terminal to stop a loop that will not finish.

### Stop a loop with `break`

Sometimes you discover the stopping point inside the loop. `break` leaves the nearest enclosing loop immediately:

```{code-cell} python
readings = [2.0, 4.0, 9.0, 3.0]    # Search for the first reading above a threshold.
for reading in readings:
    if reading > 8:
        print("First high reading:", reading)
        break                      # Stop looking after the first match.
    print("Checked:", reading)     # Runs only when break was not reached.
```

This prints checks for `2.0` and `4.0`, then reports `9.0` and stops. The final `3.0` is never visited. `break` works in a `while` loop too. A common input pattern is `while True:` with a `break` when the required answer arrives. Without a reachable `break`, that pattern keeps running.

**Try it:** move `9.0` to the start of the list and predict which messages disappear.

### Question 8 — Guess the Number

Create `q8.py`. The computer should choose a whole number between 1 and 20, including both limits, and keep that target fixed until the game ends. Use these lines before your guessing loop:

```python
import random                    # Load Python's built-in random-number module.
target = random.randint(1, 20)    # Pick an integer; both endpoints are included.
```

A **module** provides code you can reuse. `import random` makes this standard Python module available. No extra installation is needed. `random.randint(1, 20)` calls its integer-selection function. Modules receive fuller treatment in Week 5. These two lines are enough for this game.

Inside a `while` loop, ask for an integer guess. Print `Too low` when it is below the target and `Too high` when it is above. When it equals the target, print `Correct` and finish. Use `while True` with `break`, or a condition that changes when the right answer is entered.

For testing, temporarily replace the random target with `target = 7`. Enter `3`, `9`, then `7`. Expect `Too low`, `Too high`, then `Correct`, and no fourth prompt. Also test a correct first guess. Restore the random choice afterwards. Keep the target assignment outside the loop so it does not change after every guess. Assume valid integer input for this exercise.

<iframe title="Question 8 walkthrough: guess the number" width="560" height="315" src="https://www.youtube-nocookie.com/embed/sZX6PiBaQJ4" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can now control both the items a loop visits and when it stops. The next activity combines positions, slices, and decisions to reveal a message hidden inside text.

## Investigate a mystery message

### Question 9 — Another DNA Mystery Message

A secret message is hidden in the DNA-like sequence below. Your task is to write a program that converts it into symbols, then investigate what those symbols mean. You will combine a `for` loop, slicing, and the decisions you learned in Week 2.

Create `q9.py` and copy this starting data into it. Keep the whole sequence inside the quotation marks, without adding spaces or line breaks.

```python
# Store the encoded message as one string.
dna = "ATGATGTGATGATGATAATAATGATAATAATAATGAATGATGATGTAATGAATGTGATGATGAATGTAATAATGAATGATGTGATAATGAATGATGATGATGTGATAATAATAATGAATGATGTAATGATAATGATGATGATAATAATGATAATAATAATGATAATGAATGATGTGATAATAATAATGATAAATGTGATGATGAATGATGTGATGATGAATGATGATGTGAATGTAATAAATGTGAATGTGAATGTAATGATAAATGTAATGATGATGAATGTAATAATGAATGATGTGATAATGAATGATGATGATGTGATAATAATAATGAATGATGTAATGATAATGATGATGAATGATGATGTAATGATAATAATAATGAATGATGTGATAAATGTAAATGTGAATGTGATGATGAATGATGTGATGATGATAATAAATGTGAATGTAAATGTGATAATAATAATGAATGTAATAATGATGATGAATGTAATAATGAATGATGATGATGTGAATGTGATAAATGTGATGATGATAAATGTAATAATGATAATAATAATGAATGATGTAATGATGATGAATGTGAATGTAAATGTGAATGTAAATGTGATGATGAATGATGTGATGATGATAAATGATGTGAATGATGTGAATGTGATGATGAATGTAATAATGAATGATGATGATGTGAATGTGATAAATGTGATGATGATAAATGTAATAATGATAATAATAATGAATGATGTAATGATGATGAATGTAAATGTGAATGTGAATGTAATAATAATGATAATAATAATGAATGATGTGATAAATGTAAATGTGAATG"
```

Read the sequence in groups of **three characters**, starting at the beginning. We will call each group a *codon* here, but these rules belong to the puzzle rather than biological translation:

| Codon | Add to your message |
| --- | --- |
| `ATG` | A dot: `"."` |
| `TAA` | A dash: `"-"` |
| `TGA` | One space: `" "` |
| Any other group | Nothing. Move on to the next group. |

Build your program one step at a time:

1. Create a variable called `message` containing an empty string. This will hold the symbols as you collect them.
2. Use a `for` loop to visit starting positions `0`, `3`, `6`, and so on. Use `range` with a start of `0`, a stop of `len(dna)`, and a step of `3`. Each iteration should process one group.
3. Inside the loop, slice out the three characters beginning at the current position and store them in `codon`. Remember that a slice includes its start position and stops just before its end position, so the end must be the current position plus three.
4. Use `if` and `elif` to compare `codon` with the groups in the table. Use `==` for each comparison. Add the matching symbol to `message` using string concatenation or `+=`. Keep these decisions inside the loop so they run for every group.
5. Leave `message` unchanged if a group does not match. Preserve every space the rules produce, including consecutive spaces. Do not use `.strip()` or otherwise remove spaces from the result.
6. After the loop, print `message` once. Put this instruction outside the loop by removing its indentation.

Before running the full puzzle, test your program with a short sequence containing one of each recognised group. Work out the expected symbols from the table and compare them with your output. Add an unrecognised group such as `CCC` and check that it adds nothing. Then restore the full sequence above.

Save and run `q9.py` in VS Code. Once your program follows the replacement rules correctly, investigate the message it produces. Write down your interpretation and explain how you reached it.

If you think you've cracked the message then speak to me during a workshop. I'll tell you if you've cracked it. If you're the first then you might win a prize!

## Skip an item carefully with `continue`

`continue` skips the rest of the current iteration and moves to the loop's next step. In a `for` loop, Python then takes the next item automatically:

```{code-cell} python
readings = [5, 0, 7]           # In this demonstration, skip zero readings.
for reading in readings:
    if reading == 0:
        continue              # Skip the remaining lines for this item.
    print("Included:", reading)
```

Only `5` and `7` are printed. `continue` does not end the entire loop as `break` does. In a `while` loop, it returns straight to the condition check. If you skip the line that updates your position, the loop may inspect the same item forever.

**Try it:** replace `continue` with `break`. Predict why `7` is no longer printed, then restore `continue`.

### Question 10 — Debugging Challenge

Create `q10.py` with this deliberately faulty program. Read it before running it: it may get stuck, so be ready to press **Ctrl+C** in the terminal.

```python
numbers = [5, -3, 0, 7, -1, 0, 9]
i = 0                         # Position of the next item to inspect.
positives = negatives = zeros = 0  # Give all three counters a starting value.

while i <= len(numbers):       # Check whether this includes an invalid index.
    n = numbers[i]
    if n > 0:
        positives =+ 1        # Check the order of these two symbols.
    elif n == 0:
        zeros += 1
    else:
        negatives += 1
    if n == 0:
        continue              # Trace where execution goes from here.
    else:
        i += 1                # Does this update happen for every item?

print("Positives:", positives)
print("Negatives:", negatives)
print("Zeros:", zeros)
```

The multiple assignment at the start gives each counter the integer zero. `numbers[i]` selects one item, so `i` must always be a valid index when that line runs. The final three prints belong after the loop.

Repair the script so each item is counted once and the program finishes. Keep a `while` loop for this exercise. For the supplied list, expect `Positives: 3`, `Negatives: 2`, and `Zeros: 2`. You may remove the `continue` branch if that makes the control flow clearer.

Test `[0]`, `[1, 2]`, `[-1, -2]`, and `[]` as well. These short cases help separate the stopping problem from the counting problem. For any test, the three counts should add up to the number of input items. Explain each repair before checking the [Week 3 solutions](../solutions.md#week-3).

You have practised visiting items, updating results, and stopping correctly. The following optional task combines those ideas into a small summary of measurement data.

## Optional mini-project: summarise sensor readings

Create `sensor_summary.py` in your `week-3` folder. Use `[36.5, 37.0, 38.5, 39.0]` as simulated temperature readings and `38.0` as a threshold. This exercise summarises a fixed list. It does not connect to hardware.

Use a loop to calculate the total and count how many readings are strictly above the threshold. After the loop, report the total, mean, minimum, maximum, and count above the threshold. You may use `min` and `max` once you have checked that the list is nonempty.

Expect total `151.0`, mean `37.75`, minimum `36.5`, maximum `39.0`, and two values above the threshold. Test an empty list and print `No readings to summarise.` rather than trying to calculate its mean, minimum, or maximum. Add a reading exactly equal to `38.0` and check that the above-threshold count stays at two.

If you want more practice, ask a partner or an AI tool for one challenge at a time combining lists, loops, and Week 2 conditions. If the first questions are too easy, ask for harder ones within Weeks 1–3. Check suggested answers by running examples yourself. For solo practice, modify one input or condition in each of your scripts and predict the outcome before running it.

## When a loop does not work

| Symptom | What to check |
| --- | --- |
| Python cannot find your script | Use `pwd` and `ls`. Check that you saved it in `week-3` and used the correct filename. |
| The total contains only the last value | Initialise it before the loop so it is not reset on each iteration. |
| `IndexError` | The last valid nonnegative index is `len(items) - 1`. A position equal to the length is too large. |
| One item or multiplication row is missing | `range` excludes its stop value. Trace the first and last values it supplies. |
| The loop will not finish | Press Ctrl+C, then check what changes the `while` condition and whether `continue` skips that change. |
| The list has become `None` | Call `items.append(value)` on its own. Do not assign its return value to `items`. |
| A numeric calculation raises `TypeError` | Convert each response before appending it to your list. |
| A counter stays at one | Check `+=` versus `=+`. The latter assigns positive one each time. |
| The mean, minimum, or maximum fails | Check for an empty list before calculating the summary. |
| Too many messages appear | Check whether a final report has accidentally been indented inside the loop. |

Try a list with one item before a long dataset. Print the current item and counter inside the loop to see when they change. When asking for help, share the input, expected result, actual result, and the smallest script that shows the problem.

## Bring the week's ideas together

Return to your saved scripts and choose one `for` loop and one `while` loop to explain aloud. Identify what each visits, which values change, and why it stops. Then choose a counter or total and trace it over three iterations on paper.

Compare your work with the [separate solutions](../solutions.md#week-3), including the optional sensor summary. These skills also support the repeated measurements and sequence processing in [Project 1](../projects.md).

In Week 4, you will give useful blocks of code their own names as functions and read data from files. The loops you wrote this week will remain useful: instead of typing every value yourself, you will process data loaded by your program.
