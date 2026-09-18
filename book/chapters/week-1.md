---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 1: Strings, variables, and input/output

## Learning goals

By the end of this chapter, you can store values in variables, display results with `print`, collect text with `input`, and use string methods and slicing to manipulate DNA sequences.

## Your first Python statements

Python evaluates a statement and moves to the next one. `print` displays a value. A variable gives a value a name so that later statements can use it.

```{code-cell} python
name = "Alex"
print(f"Hello, {name}!")
```

The `f` before the string lets Python insert the value of `name` where `{name}` appears. This is an f-string. It is usually easier to read than joining many strings with `+`.

`input()` also returns text. For example, `name = input("Name: ")` waits for a person to type a response. We use fixed values in the examples on this site so that the pages can run automatically.

## Strings are sequences of characters

DNA can be represented as a string. String methods return a new string; they do not change the original string.

```{code-cell} python
dna = "aCgTtg"
print(dna.upper())
print(dna.lower())
print("Length:", len(dna))
```

Use `+` to concatenate strings. Use slicing to select part of a string. A step of `-1` reads the characters backwards.

```{code-cell} python
first = "actg"
second = "tta"
combined = (first + second).upper()
print(combined)
print("Reverse:", combined[::-1])
```

Parentheses make clear that concatenation happens before `.upper()` is applied. The sequence here is reversed, but it is not yet a reverse complement: reversing and complementing are separate operations.

## From DNA to RNA

`replace` substitutes every matching substring. Multiplying a string repeats it, which is useful for constructing a poly-A tail.

```{code-cell} python
dna = "ACTGTTA"
rna = dna.replace("T", "U")
rna_with_tail = rna + "A" * 7
print(rna_with_tail)
print("Length:", len(rna_with_tail))
```

The length is 14: seven bases in the RNA sequence plus seven added adenines.

## Worked example: reverse complement

To calculate a reverse complement, visit the bases from right to left and map each base to its partner. A dictionary stores the mapping.

```{code-cell} python
dna = "ACTG"
complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
reverse_complement = ""
for base in dna[::-1]:
    reverse_complement += complement[base]
print(reverse_complement)
```

The answer is `CAGT`. Reversing first matters: iterating over `dna` from left to right would produce the complement in the original orientation.

## Activities

1. Ask for a person's name and print a one-line welcome using an f-string.
2. Ask for two DNA strings. Print their uppercase concatenation and its length.
3. Convert a DNA string to RNA, then append exactly seven `A` characters.
4. Debug a reverse-complement program that gives `TGAC` for `ACTG`. Which operation is missing?
5. **Mini-project:** write a script that transforms two short DNA fragments into a reverse-complement RNA sequence with a poly-A tail. Print each intermediate result so you can check your work.

## Videos

These videos walk through string activities. Captions are available as local text files.

<iframe title="Week 1: DNA case and length" width="560" height="315" src="https://www.youtube-nocookie.com/embed/qyeJIcrAj30?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/qyeJIcrAj30.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=qyeJIcrAj30)

<iframe title="Week 1: concatenate DNA sequences" width="560" height="315" src="https://www.youtube-nocookie.com/embed/3htTsf2EQiE?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/3htTsf2EQiE.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=3htTsf2EQiE)

<iframe title="Week 1: reverse DNA sequences" width="560" height="315" src="https://www.youtube-nocookie.com/embed/rGS8ixk8uvQ?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/rGS8ixk8uvQ.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=rGS8ixk8uvQ)

The Canvas export also linked two private videos for this week. They cannot be embedded in a public book, so they are omitted.
