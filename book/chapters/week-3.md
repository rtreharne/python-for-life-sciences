---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 3: Lists and loops

## Learning goals

Lists hold multiple values in order. Loops repeat instructions, which is essential when processing many measurements or sequence characters.

## Store and inspect collections

Python list positions start at zero. A list's length is the number of items it contains.

```{code-cell} python
counts = [3, 7, 2, 9, 5]
print(counts[0])
print(counts[-1])
print("Number of samples:", len(counts))
```

Negative index `-1` means the final item. An index outside the list raises an `IndexError`; check the length or iterate over the list instead of guessing an index.

## Repeat work with `for`

Use a `for` loop when you want to do something once for each item. An accumulator starts at zero and grows as values are added.

```{code-cell} python
counts = [3, 7, 2, 9, 5]
total = 0
for count in counts:
    total += count
mean = total / len(counts)
print("Total:", total)
print("Mean:", mean)
```

The loop body is indented. `count` takes each value in turn. The mean is the total divided by the number of observations.

The same pattern can count DNA bases. Normalize to uppercase first, then keep a count for each expected base.

```{code-cell} python
dna = "aCgTtG".upper()
count_a = 0
count_c = 0
count_g = 0
count_t = 0
for base in dna:
    if base == "A":
        count_a += 1
    elif base == "C":
        count_c += 1
    elif base == "G":
        count_g += 1
    elif base == "T":
        count_t += 1
    else:
        print("Unexpected symbol:", base)
print("A:", count_a, "C:", count_c, "G:", count_g, "T:", count_t)
```

The final `else` reports unexpected characters instead of silently ignoring them. In Week 5, a dictionary will make this kind of counting more compact.

## Repeat until a condition changes

Use `while` when the number of repeats depends on a condition. The loop needs a clear stop condition and a value that changes on each pass.

```{code-cell} python
target = 7
guesses = [3, 9, 7]
for guess in guesses:
    if guess < target:
        print("Too low")
    elif guess > target:
        print("Too high")
    else:
        print("Correct")
        break
```

The `break` statement exits the loop once the answer is found. For an interactive guessing game, a `while` loop can repeat until the user guesses correctly. Always ensure each pass can move the program toward its stopping condition.

## Activities

1. Add the values `[3, 7, 2, 9, 5]` with a loop and calculate their average.
2. Ask for five numbers, store them in a list, then report the largest.
3. Count each base in a DNA string. Test lowercase input and a sequence with an unexpected symbol.
4. Print a multiplication table from 1 to 10 using `range`.
5. Build a number-guessing game. Give feedback after every guess and stop when the correct value is entered.
6. **Mini-project:** process a list of sensor readings. Report the total, mean, minimum, maximum, and number of values above a threshold.

## Videos

These selected videos demonstrate list accumulation, base counting, and looping through values.

<iframe title="Week 3: sum values in a list" width="560" height="315" src="https://www.youtube-nocookie.com/embed/2Ypp0C9OjeQ?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/2Ypp0C9OjeQ.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=2Ypp0C9OjeQ)

<iframe title="Week 3: count DNA bases" width="560" height="315" src="https://www.youtube-nocookie.com/embed/4DBaucGZYPk?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/4DBaucGZYPk.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=4DBaucGZYPk)

<iframe title="Week 3: number guessing loop" width="560" height="315" src="https://www.youtube-nocookie.com/embed/sZX6PiBaQJ4?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/sZX6PiBaQJ4.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=sZX6PiBaQJ4)

The [full Week 3 playlist](https://www.youtube.com/playlist?list=PLsWFiDvzgp8p8nIqBaTpugeJbhFpWc9uk) has walkthroughs for further list and loop exercises.
