---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 2: Numbers, types, and decisions

Last week, you collected text, stored it in variables, and changed DNA strings. This week, you will give your scripts something more to do: calculate a result and decide what it means. A program could convert a temperature, check whether a measurement is in range, or display a warning when a value needs attention.

Keep VS Code open as you work through the chapter. Try each example yourself, then change its input and predict what will happen. The aim is to understand why a result appears, so you can use the same idea with your own data.

## Get your Week 2 folder ready

Keep each week's work in its own folder. Create `week-2` inside `LIFE733`, alongside `week-1`. In VS Code, choose **File → Open Folder** and open `week-2`. Create `practice.py` in Explorer for the worked examples. As you reach each question, create a separate answer file named `q1.py`, `q2.py`, and so on.

Your folder structure will look like this once all eight answer files have been created:

```text
LIFE733/
├── week-1/          ← Your existing Week 1 work
└── week-2/          ← Open this folder in VS Code
    ├── practice.py  ← Use for examples and experiments
    ├── q1.py
    ├── q2.py
    ├── q3.py
    ├── q4.py
    ├── q5.py
    ├── q6.py
    ├── q7.py
    └── q8.py
```

This is a diagram of folders and files, not a command to run. You do not need to download any starter files.

Choose **Terminal → New Terminal**, then check where the terminal is working:

```text
pwd                 # Show your current directory.
ls                  # List the files and folders there.
```

These commands also work in PowerShell. The directory should end in `week-2`. If you are still inside `week-1`, use:

```text
cd ..               # Move up to the LIFE733 folder.
cd "week-2"         # Enter the folder you created for this week.
pwd                 # Check that you are now in week-2.
```

`..` means the parent folder. If you are already in `LIFE733`, use only `cd "week-2"`. If you are already in `week-2`, you can start writing code.

For each worked example, replace the contents of `practice.py`, save it, and run the appropriate command:

```text
python3 practice.py  # macOS/Linux: run the saved script.
```

On Windows MWS, use:

```text
python practice.py   # Windows: run the saved script.
```

Use whichever Python command worked in Week 1; if you used `py`, keep using it. Replace `practice.py` with the question's filename when running an answer. Each script starts afresh, so it needs its own input and variables.

Use this routine throughout: **predict → edit → save → run → check**. The examples with displayed outputs use fixed values. Examples containing `input()` need to be run in your terminal, where you can type a response and press Enter.

With your folder ready, start by revisiting the difference between numeric text and a number. That difference determines whether Python can calculate with the value.

## Calculate with numbers

### Choose the right type

An **integer**, or `int`, is a whole number such as `12`. A **float** is a number that can have a fractional part, such as `12.5`. Quotes make a value text: `"12"` is a string even though it contains digits.

```{code-cell} python
count_text = "12"            # A string containing two digits.
count = int(count_text)       # Convert it to a whole number.
volume = float("2.5")         # Convert numeric text to a float.
print(count_text * 2)         # Repeat the string twice.
print(count * 2)              # Multiply the integer by two.
print(volume * 2)             # Multiply the float by two.
```

The results are `1212`, `24`, and `5.0`. The operator `*` repeats a string but multiplies a number. `int(...)` and `float(...)` return converted values; assigning those results to variables lets you use them later.

Use `int` for a count or whole-number position and `float` for input that may include decimals. For example, `int("2.5")` raises a `ValueError` because the string does not represent an integer. `float("2.5")` works. Floating-point arithmetic approximates many decimal values, so long decimal results are sometimes expected.

**Try it:** change `count_text` to `"7"` and predict both outputs that use it. Then change the volume to `"1.25"`. Run the script after each change.

You have converted text into values Python can calculate with. Next, use those values in a small measurement calculation.

### Use arithmetic operators

Suppose you have 18 mL of solution and want to share it equally between four tubes:

```{code-cell} python
total_volume = 18.0                    # Total solution volume in mL.
tube_count = 4                         # Number of tubes.
volume_per_tube = total_volume / tube_count  # Divide equally.
remaining_after_one = total_volume - volume_per_tube  # Subtract one portion.
print("Volume per tube:", volume_per_tube)
print("Remaining after one tube:", remaining_after_one)
```

`/` divides the first value by the second, giving `4.5` mL per tube. `-` subtracts one portion, leaving `13.5` mL. Each assignment works out the expression on the right before storing its result on the left. Python's `/` operator returns a float even when the division has a whole-number answer.

| Operator | Meaning | Example and result |
| --- | --- | --- |
| `+` | Add | `8 + 3` gives `11` |
| `-` | Subtract | `8 - 3` gives `5` |
| `*` | Multiply | `8 * 3` gives `24` |
| `/` | Divide | `8 / 2` gives `4.0` |
| `**` | Raise to a power | `2 ** 3` gives `8` |
| `%` | Find the remainder after division | `8 % 3` gives `2` |

**Try it:** change the total volume to `25.0` and the number of tubes to `5`. Check that each tube receives `5.0` mL. Keep the number of tubes above zero: division by zero raises `ZeroDivisionError`. Later in this chapter, you will learn how to check for that before dividing.

### Question 1 — Simple Calculator

Create `q1.py`. Ask for two numbers using `input`, and convert each response to `float`. Print their sum, difference, product, and quotient. For subtraction and division, use the first number followed by the second number. For now, assume that the second number is not zero.

For inputs `10` and `4`, expect:

```text
Sum: 14.0
Difference: 6.0
Product: 40.0
Quotient: 2.5
```

The `.0` endings are expected because you used floats. Test again with `7.5` and `2.5`: the results should be `10.0`, `5.0`, `18.75`, and `3.0`. Then watch the walkthrough and compare its approach with yours.

<iframe title="Question 1 walkthrough: simple calculator" width="560" height="315" src="https://www.youtube-nocookie.com/embed/3u9jLOA7HOo" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Your calculator used one operator at a time. A formula often combines several. The next example shows how to make the order of those calculations clear.

## Turn a formula into Python

Python evaluates multiplication and division before addition and subtraction. Parentheses let you group a calculation that needs to happen first.

```{code-cell} python
reading_1 = 4.0                     # First measurement.
reading_2 = 8.0                     # Second measurement.
mean = (reading_1 + reading_2) / 2  # Add both readings before dividing.
without_grouping = reading_1 + reading_2 / 2  # Divide reading_2 first.
print("Mean:", mean)
print("Without grouping:", without_grouping)
```

The mean is `6.0`. Without the parentheses, Python calculates `8.0 / 2` first and then adds `4.0`, giving `8.0`. Write the calculation on paper before translating it into code; the placement of parentheses can change the answer.

**Try it:** use readings `3.0` and `9.0`. Predict both results, then check them. The correct mean is still `6.0`; the ungrouped calculation gives `7.5`.

When displaying a result, you can choose how many decimal places to show:

```{code-cell} python
volume = 10 / 3                     # Keep the calculated value.
print(f"Volume: {volume:.2f} mL")   # Display it with two decimal places.
print(volume)                      # Show the value without that formatting.
```

The first line of output is `Volume: 3.33 mL`. Inside the f-string, `volume` names the value, `:` starts the formatting instruction, and `.2f` asks for two digits after the decimal point. Formatting changes the display, not the value stored in `volume`. Use `.1f` to display one decimal place.

### Question 2 — Temperature Converter

Create `q2.py`. Ask for a Celsius temperature, convert it to `float`, and calculate Fahrenheit using `fahrenheit = celsius * 9 / 5 + 32`. Print the result with one decimal place.

Check `20` → `Fahrenheit: 68.0`, `0` → `Fahrenheit: 32.0`, and `-40` → `Fahrenheit: -40.0`. Negative input is valid here. Try the question before watching its walkthrough.

<iframe title="Question 2 walkthrough: temperature converter" width="560" height="315" src="https://www.youtube-nocookie.com/embed/yeQpUR04a6c" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can now calculate a temperature. To decide whether that temperature is too high or within a useful range, your program needs a comparison.

## Compare a value and choose what happens

### Ask a question that has a true or false answer

A comparison returns a **Boolean** value: `True` or `False`. Both words begin with a capital letter and are written without quotes.

```{code-cell} python
temperature = 39.0               # An example temperature in degrees Celsius.
is_high = temperature > 38       # Compare the value with a threshold.
print(is_high)
print(temperature == 37)         # Test whether the value equals 37.
```

The outputs are `True` and `False`. `>` asks whether the left value is greater than the right value. `==` tests equality. One `=` assigns a value; two equals signs compare values.

| Comparison | Meaning |
| --- | --- |
| `==` | Equal to |
| `!=` | Not equal to |
| `<` | Less than |
| `>` | Greater than |
| `<=` | Less than or equal to |
| `>=` | Greater than or equal to |

**Try it:** set the temperature to `38.0`, then `37.0`. Predict each Boolean result. Notice that `38 > 38` is false: use `>=` if the limit itself should count.

A Boolean result tells you whether a condition is met. An `if` statement uses that result to choose which instructions to run.

### Use `if` and `else`

```{code-cell} python
temperature = 39.0       # Change this to test the two possible paths.
if temperature > 38:    # Run the next indented line when this is true.
    print("Check the temperature.")
else:                   # Otherwise, run this indented line.
    print("Temperature is not above 38.")
print("Check complete.")  # This line runs after either path.
```

For `39.0`, Python prints `Check the temperature.` and then `Check complete.`. The colon ends the `if` condition. The four spaces before the next line show that it belongs to that branch. `else` has no condition: it handles the case where the `if` condition is false. Align `else` with `if`.

The final `print` has no indentation, so it runs whichever branch was chosen. Use four spaces consistently; moving a line in or out of a block changes when it runs.

**Try it:** use `37.0`, then `38.0`. Both should take the `else` branch. Explain why the final message appears every time.

### Question 3 — Even or Odd?

Create `q3.py`. Ask for an integer, then use `if` and `else` to report whether it is even or odd. The remainder operator helps here: an integer is even when dividing it by two leaves a remainder of zero. In Python, that test is `number % 2 == 0`.

For input `7`, print `7 is odd`. Check that `8` gives `8 is even` and that `0` is also even. Use `int` for this question because it asks about whole numbers. Watch the walkthrough after trying your script.

<iframe title="Question 3 walkthrough: even or odd" width="560" height="315" src="https://www.youtube-nocookie.com/embed/aYVK1TAJh1Q" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can also use `if` to prevent an operation that would fail. Return to the division in Question 1 and consider what should happen when the second number is zero:

```{code-cell} python
first = 10.0                      # Numerator for this example.
second = 0.0                      # Deliberately test a zero divisor.
if second == 0:                   # Check before attempting division.
    print("Cannot divide by zero.")
else:
    print("Quotient:", first / second)  # Divide only when it is safe to do so.
```

This prints `Cannot divide by zero.`. Python does not evaluate the division in the unchosen branch. **Try it:** change `second` to `4.0`, then add this check to your calculator while keeping its other three calculations.

So far, each decision has had two outcomes. A grade classifier needs several. You will handle those with `elif` and pay attention to the order of the tests.

## Choose between several outcomes

`elif` means “else if”: try another condition when the earlier one was false. Here is a practice classification for a sample volume. These thresholds belong only to this example.

```{code-cell} python
volume = 7.0                    # Sample volume in mL.
if volume >= 10:                # Test the highest threshold first.
    label = "Large sample"
elif volume >= 5:               # Reached only when volume is below 10.
    label = "Medium sample"
else:                          # Reached only when volume is below 5.
    label = "Small sample"
print(label)                    # Every branch assigns label before this line.
```

The result is `Medium sample`. Python runs the first matching branch and skips the rest of the chain. The second branch covers values from 5 up to, but not including, 10. You do not need to repeat `volume < 10`: the first test has already ruled out larger values.

**Try it:** test `4.9`, `5`, `9.9`, and `10`. Then predict what would go wrong if you tested `volume >= 5` before `volume >= 10`. A volume of `12` would match the lower threshold first and receive the wrong label.

### Question 4 — Grade Classifier

Create `q4.py`. Ask for a mark and convert it to `float` so decimal marks work too. First check whether it is outside 0–100; if so, print `Invalid mark`. You can use one branch for a mark below zero and another for a mark above 100. Otherwise, apply these bands:

| Mark | Output |
| --- | --- |
| 70–100, inclusive | `Grade: Distinction` |
| 60 up to, but not including, 70 | `Grade: Merit` |
| 50 up to, but not including, 60 | `Grade: Pass` |
| 0 up to, but not including, 50 | `Grade: Fail` |

Use one `if`/`elif`/`else` chain, with invalid values checked before grade thresholds. Test `49.9`, `50`, `59.9`, `60`, `69.9`, `70`, and `100`, as well as `-1` and `101`. Input `65` should print `Grade: Merit`. Then compare your approach with the walkthrough; your version also checks invalid marks.

<iframe title="Question 4 walkthrough: grade classifier" width="560" height="315" src="https://www.youtube-nocookie.com/embed/Cq4EZXdrxx0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Checking one condition at a time works well for grade bands. Other decisions depend on several things being true together. Boolean operators let you combine those checks.

## Combine conditions with `and`, `or`, and `not`

For this example, a sample is ready only when it is labelled and its volume is sufficient:

```{code-cell} python
has_label = True                       # A Boolean value, without quotes.
volume = 3.0                          # Sample volume in mL.
has_enough_volume = volume >= 2        # Store the result of a comparison.
ready = has_label and has_enough_volume  # Both conditions must be true.
needs_attention = not ready           # Reverse the Boolean result.
print("Ready:", ready)
print("Needs attention:", needs_attention)
```

This prints `Ready: True` and `Needs attention: False`. For Boolean conditions, `and` is true only when both sides are true. `or` is true when at least one side is true, including when both are true. `not` reverses a Boolean: `not True` is `False`.

**Try it:** change `has_label` to `False`, then restore it and change `volume` to `1.0`. Either change should make `ready` false. Both requirements matter.

You can use `or` to combine the two invalid-mark checks from Question 4: `mark < 0 or mark > 100`. Parentheses can group conditions and make a longer expression easier to read. Always write each comparison in full: `answer == "yes" or answer == "y"`, rather than `answer == "yes" or "y"`. The latter treats the nonempty string `"y"` as true regardless of the answer.

For yes/no input, first tidy the text and then compare it with the response you expect:

```python
answer = input("Is the sample labelled? ")  # Collect a string from the terminal.
answer = answer.strip().lower()             # Remove end spaces and lowercase it.
has_label = answer == "yes"                 # Convert the comparison to a Boolean.
print("Label confirmed:", has_label)
```

`.strip()` removes whitespace from the start and end; `.lower()` then changes the remaining text to lowercase. Typing ` YES ` therefore gives `True`. Typing `no` gives `False`. The text `"False"` itself is still a nonempty string, so use a comparison to obtain a Boolean rather than treating a typed word as one.

### Question 5 — Boolean Logic

Create `q5.py`. Ask `Has ID card? ` and `Has lab coat? `. Normalise both responses with `.strip().lower()`, then compare each with `"yes"`. Grant access only when both comparisons are true. Print `Access granted.` or `Access denied.`.

For this exercise, only a normalised `yes` counts as confirmation; any other answer counts as no. Test all four combinations: yes/yes grants access, while yes/no, no/yes, and no/no deny it. Also try ` YES ` to check your text handling. This is a practice rule for the exercise. Watch the walkthrough after testing your answer.

<iframe title="Question 5 walkthrough: Boolean logic" width="560" height="315" src="https://www.youtube-nocookie.com/embed/rKW7KjgDePI" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You have used conversion, comparisons, and branches together. The next task gives you a script where those pieces do not fit correctly yet. Fixing it will help you recognise the same mistakes in your own code.

## Find and fix a faulty conditional

### Question 6 — Bug Hunt

Copy this deliberately broken script into `q6.py`:

```python
num = input("Enter a number: ")  # Check the type this returns.

if num > 0:                     # This comparison needs a numeric value.
    print("Positive")
elif num = 0:                   # Check the operator used to compare values.
    print("Zero")
else                            # Check how a branch header must end.
    print("Negative")
```

The intended behaviour is `7` → `Positive`, `0` → `Zero`, and `-3` → `Negative`. Support decimal input too. Before running it, identify what you think is wrong. Then run it and read the error message. Fix one problem at a time, save, and run again.

Python checks syntax before executing the program, so a syntax error can appear before it asks for input. Once the syntax is correct, a type error may reveal that you are comparing text with a number. Check the conversion, the equality operator, and the colon after each branch header. You do not need loops or exception handling to solve this task.

Once all three checks pass, explain why zero reaches the middle branch. You are now ready to combine several comparisons into a rule with an exception.

## Build a rule with an exception

A leap year follows a divisibility rule. Years divisible by four are usually leap years, but century years must also be divisible by 400. The remainder operator lets you test each part separately:

```{code-cell} python
year = 1900                         # A century year that tests the exception.
divisible_by_4 = year % 4 == 0       # True when division leaves no remainder.
divisible_by_100 = year % 100 == 0
divisible_by_400 = year % 400 == 0
is_leap_year = (divisible_by_4 and not divisible_by_100) or divisible_by_400
print("Divisible by 4:", divisible_by_4)
print("Divisible by 100:", divisible_by_100)
print("Divisible by 400:", divisible_by_400)
print("Leap year:", is_leap_year)
```

The first three results are `True`, `True`, and `False`; the final result is `False`. The parentheses group the ordinary rule: divisible by four and not a century. The final `or` allows a year divisible by 400 to qualify. For `1900`, neither route qualifies; for `2000`, the second route does.

**Try it:** change the year to `2000`, then `2020`, then `2023`. Inspect the three intermediate Booleans before the final answer. Giving each test a name makes the rule easier to trace than putting everything into one long line.

### Question 7 — Leap Year Checker

Create `q7.py`. Ask for a year as an integer, calculate whether it is a leap year, and use `if`/`else` to print `Leap year!` or `Not a leap year.`. Assume a positive year and use the Gregorian calendar rule above.

Check `1900` → not leap, `2000` → leap, `2020` → leap, and `2023` → not leap. Explain why checking divisibility by four alone would give the wrong answer for `1900`.

You have combined simple checks into one decision. The final coding task uses the same approach with two measurements: each must fall within its own range before the overall result can be accepted.

## Bring the checks together in a lab monitor

### Question 8 — Lab Equipment Monitor

Create `q8.py` for a practice incubator monitor. For this exercise, its status is `SAFE` only when both of these conditions hold:

| Measurement | Allowed range |
| --- | --- |
| Temperature | 36–38 °C, including both limits |
| pH | 6.8–7.2, including both limits |

These are the rules of this exercise, not general operating limits for laboratory equipment. Build the script in stages:

1. Ask for temperature and pH, converting each response to `float`.
2. Store a Boolean for whether the temperature is in range. Use two comparisons joined with `and`.
3. Store another Boolean for whether pH is in range.
4. Combine the two Booleans to decide the status.
5. Print `Incubator status: SAFE` or `Incubator status: UNSAFE`.

For example, input `37` and `7.0` should give `Incubator status: SAFE`. Input `39` and `7.0` should give `Incubator status: UNSAFE`.

Check the limits as well as the middle of each range. Temperatures `36` and `38` should pass with pH `7.0`; pH values `6.8` and `7.2` should pass with temperature `37`. Then try `35.9`, `38.1`, `6.7`, and `7.3` as values just outside the limits. Print your intermediate Booleans while testing if you need to see which check failed.

**Extension:** print a specific warning for each measurement outside its range. When both are wrong, print both warnings. Use two independent `if` statements here: an `if`/`elif` chain would stop after the first match and hide the second warning. You can use `not temperature_ok` and `not ph_ok` to test the Booleans you already calculated.

You have now written scripts that calculate values and make decisions from them. If a result differs from your prediction, use the checks below to find the step that needs attention.

## When the result is not what you expected

| Symptom | What to check |
| --- | --- |
| Python cannot find the file | Use `pwd` and `ls`; confirm that you saved the file in `week-2` and used its correct name. |
| The old result still appears | Save the file and run the script you edited. |
| `SyntaxError` at a condition | Check for `==` when comparing, and a colon at the end of `if`, `elif`, or `else`. |
| `IndentationError` | Align branch headers and use four spaces for their contents. |
| Text repeats instead of multiplying | Convert input to `int` or `float` before arithmetic. |
| `TypeError` during a comparison | Check that both sides are suitable types; an input string cannot be ordered against a number. |
| `ValueError` during conversion | Use numeric input; `int("3.5")` fails while `float("3.5")` works. |
| `ZeroDivisionError` | Check the divisor before performing division. |
| A threshold gives the wrong label | Check `<` versus `<=`, the order of branches, and the exact boundary value. |
| Only one warning appears | Use separate `if` statements when multiple messages may be needed. |

Errors are part of working out a program. Keep the input small enough to check by hand, and print intermediate values to find the first unexpected result. When asking for help, include the code, input, expected output, and error or actual output.

## Optional practice: explain and test your understanding

After checking your scripts against the [Week 2 solutions](../solutions.md#week-2), try explaining a condition without looking at the code. The following activities adapt the original worksheet's Questions 9 and 10. You can use a conversational AI tool, work with a partner, or practise alone.

### Activity 9 — A quiz, one question at a time

Use this prompt with an AI tool or give these instructions to a partner:

> Help me practise beginner Python from Weeks 1 and 2: input/output, variables, strings, numeric conversion, arithmetic, comparisons, conditionals, and Boolean logic. Ask one question at a time and wait for my answer. Mix predicting output, writing a few lines, and fixing a bug. Start with simple questions and gradually combine ideas. Ask me to run code in VS Code to check my reasoning. Give feedback after my attempt. Stop after ten questions or when I ask to stop. Avoid loops, functions, and external packages.

After the quiz starts, ask for harder questions if the first few feel too easy. For example:

> These questions are too easy for me. Please make the next ones harder by combining several ideas from Weeks 1 and 2. Keep asking one question at a time, and stay within those topics.

For solo practice, choose ten small changes to this chapter's examples. Write down the expected output before running each one. Keep a note of any prediction that was wrong and explain what you learned from it.

### Activity 10 — Teach the idea to someone else

Ask a partner or an AI tool to play a beginner who asks questions about the week's code. If using an AI tool, you can give it this prompt:

> Act as a beginner learning Python strings, numbers, comparisons, conditionals, and Boolean logic. Ask me one question at a time. Occasionally offer a mistaken explanation or a short incorrect example for me to correct. Wait while I explain and demonstrate a working example in VS Code. Cover eight questions, then ask which ideas I found hardest to explain. Stay within Weeks 1 and 2; avoid loops and functions.

Check suggested answers by running small examples; feedback can be mistaken. If working alone, take the bug hunt and explain each correction aloud, then deliberately change one grade boundary and explain which test reveals the mistake.

## What comes next

Before moving on, check that your `week-2` folder contains eight saved answers that you can run again. Pick a script and explain its inputs, calculations, conditions, and possible outputs. You should be able to say what happens at a boundary, not just for the first example you tried.

You can now attempt more of [Project 1](../projects.md), especially its calculations and classification tasks. In Week 3, loops and collections will let you repeat this week's checks across groups of measurements. The decisions stay familiar; you will learn how to apply them without writing the same code for every item.
