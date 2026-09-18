---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 2: Numbers, types, and decisions

## Learning goals

You will use arithmetic, convert text to numbers, compare values, and write `if`, `elif`, and `else` branches. These tools let a program respond to measurements instead of printing the same result every time.

## Numbers and conversion

`input` returns a string, even when someone types digits. Convert the response with `int` for whole numbers or `float` for values that may contain decimals.

```{code-cell} python
celsius = 20.0
fahrenheit = celsius * 9 / 5 + 32
print(f"{celsius:.1f} °C is {fahrenheit:.1f} °F")
```

The operators `+`, `-`, `*`, `/`, `**`, and `%` mean addition, subtraction, multiplication, division, exponentiation, and remainder. The remainder operator is useful for divisibility tests: `number % 2 == 0` means an even integer.

## Comparisons and branches

Comparisons produce a Boolean value, either `True` or `False`. Indentation marks which statements belong to each branch.

```{code-cell} python
mark = 65
if mark >= 70:
    grade = "Distinction"
elif mark >= 60:
    grade = "Merit"
elif mark >= 50:
    grade = "Pass"
else:
    grade = "Fail"
print(grade)
```

The order is deliberate. Once a condition is true, Python skips the remaining branches. If the `mark >= 60` test came first, a mark of 75 would be classified as Merit.

Boolean operators combine conditions. A leap year is divisible by 4 and not by 100, unless it is also divisible by 400.

```{code-cell} python
year = 2000
is_leap_year = (year % 4 == 0 and year % 100 != 0) or year % 400 == 0
print(is_leap_year)
```

Here, `and` requires both conditions to be true; `or` requires at least one. Parentheses make the intended grouping explicit.

## Validate before classifying

Suppose an assay is valid only when every replicate lies between 0 and 2000 mg/L. Check that boundary before using the values in later classifications.

```{code-cell} python
concentration = 108
if concentration < 0 or concentration > 2000:
    result = "Invalid measurement"
else:
    result = "Measurements in range"
print(result)
```

For a set of replicates, apply the same check to each measurement. The loop chapter will show how to repeat a check across a list.

## Activities

1. Convert 20 °C to Fahrenheit and test a second temperature.
2. Ask for an integer and report whether it is even or odd. Convert the input before using `%`.
3. Classify a mark into Distinction, Merit, Pass, or Fail. Decide how your program should handle values below 0 or above 100.
4. Write a leap-year checker and test 1900, 2000, 2020, and 2023.
5. **Mini-project:** classify three protein concentration replicates. First reject values outside 0–2000. Then distinguish a failed assay (all below 10), identical replicates, and measurements that are within 20% of their mean.

## Videos

<iframe title="Week 2: numbers and arithmetic" width="560" height="315" src="https://www.youtube-nocookie.com/embed/3u9jLOA7HOo?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/3u9jLOA7HOo.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=3u9jLOA7HOo)

<iframe title="Week 2: temperature conversion" width="560" height="315" src="https://www.youtube-nocookie.com/embed/yeQpUR04a6c?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/yeQpUR04a6c.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=yeQpUR04a6c)

<iframe title="Week 2: even or odd" width="560" height="315" src="https://www.youtube-nocookie.com/embed/aYVK1TAJh1Q?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/aYVK1TAJh1Q.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=aYVK1TAJh1Q)

<iframe title="Week 2: grade classification" width="560" height="315" src="https://www.youtube-nocookie.com/embed/Cq4EZXdrxx0?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/Cq4EZXdrxx0.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=Cq4EZXdrxx0)

<iframe title="Week 2: Boolean logic" width="560" height="315" src="https://www.youtube-nocookie.com/embed/rKW7KjgDePI?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/rKW7KjgDePI.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=rKW7KjgDePI)
