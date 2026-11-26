---
title: "Week 10: Plotting with matplotlib, numpy arrays, and simple statistics"
authors:
  - name: Andy Jones
---

# Week 10: Plotting with matplotlib, numpy arrays, and simple statistics

In Weeks 8 and 9, you produced BLAST hits, alignments, conservation scores,
and trees. Results like these are hard to interpret as lists of numbers.
This week, you will learn to turn data into clear figures with **matplotlib**,
Python's main plotting library. You will also meet **numpy** arrays, which
store numbers efficiently and let you calculate on a whole dataset at once,
and use **scipy** to fit a straight line to two variables.

You have already used matplotlib without seeing it: `Phylo.draw` in Week 9
draws its trees with matplotlib. This week shows what happens behind that
call, so that you can build and customise your own figures.

## What you will learn

By the end of this chapter, you should be able to:

- create a figure with `plt.subplots` and explain the roles of the `Figure`
  and `Axes` objects
- draw line plots, box plots, violin plots, histograms, and scatter plots
- set axis labels, titles, limits, colours, markers, line styles, and legends
- apply matplotlib's built-in styles
- arrange several plots in one figure, in one row or column or in a grid
- save figures as high-resolution PNG and PDF files
- create, index, slice, and filter numpy arrays and calculate with them
- read columns from a CSV file and plot them
- fit a linear regression with `scipy.stats` and add the fitted line to a
  scatter plot.

## Set up your Week 10 folder

Create a `week-10` folder alongside your earlier weekly folders. Keep the
supplied CSV file unchanged and save each script and figure with a new name:

```text
LIFE733/
└── week-10/
    ├── peptide_small.csv
    ├── q1.py … q8.py
    ├── q1_line_plot.png              ← Created in Question 1
    ├── q2_boxplot.png                ← Created in Question 2
    ├── q2_violinplot.png             ← Created in Question 2
    ├── styles/                       ← Created in Question 3 (one PNG per style)
    ├── q4_score_histogram.png        ← Created in Question 4
    ├── q5_peptide_panels.png         ← Created in Question 5
    ├── q5_peptide_panels.pdf         ← Created in Question 5
    ├── q7_mass_vs_rt.png             ← Created in Question 7
    ├── q7_length_vs_mass.png         ← Created in Question 7
    ├── q7_mass_vs_rt_length.png      ← Created in Question 7
    └── q8_conservation_plot.png      ← Created in Question 8
```

[Download `peptide_small.csv`](/week-10/peptide_small.csv) (about 7 MB) into
your `week-10` folder. It is also
[on Canvas](https://canvas.liverpool.ac.uk/courses/95131/files/14451759?module_item_id=2725155).
Question 8 also uses `human_mapk_aligned.fasta` from your `week-9` folder. The
[Week 10 slide deck on Canvas](https://canvas.liverpool.ac.uk/courses/95131/files/14767540?module_item_id=2782232)
is an optional companion.

This chapter needs three packages: `matplotlib`, `numpy`, and `scipy`. On a
University-managed computer, they are included in the Python common plugins
available through **Install University Applications**. On your own computer,
install them with pip, then check that they import:

```bash
python -m pip install matplotlib numpy scipy
python -c "import matplotlib, numpy, scipy; print(matplotlib.__version__, numpy.__version__, scipy.__version__)"
```

On Windows, use `py` in place of `python` if that is how you run Python. The
examples were tested with matplotlib 3.10, numpy 2.4, and scipy 1.15. Older
versions from the last few years should also work.

## Draw your first plot

<iframe title="Figure and Axes" width="560" height="315" src="https://www.youtube.com/embed/8n3zcXdGXj8" loading="lazy" allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

matplotlib can be used in two ways:

1. **The pyplot, or command-style, interface.** You call functions such as
   `plt.plot` and `plt.xlabel`, and matplotlib keeps track of the current
   figure behind the scenes. This is quick to type, but it is less clear which
   object each command changes.
2. **The object-oriented interface.** You ask matplotlib for a `Figure` and
   one or more `Axes`, store them in variables, and call methods on them. This
   gives you access to all of matplotlib's features and is easier to read and
   debug.

You will find many examples of the first style online. This chapter uses only
the second. The [Lifecycle of a Plot
tutorial](https://matplotlib.org/stable/tutorials/lifecycle.html) explains the
difference in more detail.

:::{tip} Reading pyplot examples online
matplotlib's own documentation, Stack Overflow answers, and AI assistants
often mix the two styles. To convert a pyplot example, put anything that
draws or labels data on `ax.`, and anything about the whole image on `fig.`:

| pyplot style | Object-oriented style |
|---|---|
| `plt.plot(x, y)` | `ax.plot(x, y)` |
| `plt.hist(data)` | `ax.hist(data)` |
| `plt.xlabel("Time")` | `ax.set_xlabel("Time")` |
| `plt.ylabel("Count")` | `ax.set_ylabel("Count")` |
| `plt.title("Title")` | `ax.set_title("Title")` |
| `plt.xlim(0, 10)` | `ax.set_xlim(0, 10)` |
| `plt.legend()` | `ax.legend()` |
| `plt.savefig("plot.png")` | `fig.savefig("plot.png")` |

Most `plt.something(...)` functions that set a property become
`ax.set_something(...)`. Functions that draw, such as `plot`, `hist`, and
`legend`, keep the same name. Start each figure with
`fig, ax = plt.subplots()`.
:::

The two objects are:

- **`Figure`**: the whole image. It controls the overall size, resolution
  (dots per inch, or DPI), and background colour, and it is what you save.
- **`Axes`**: one plotting area within the figure, with its own x and y axes.
  You draw data and set labels, limits, and titles through the `Axes`. A
  figure can contain several `Axes`.

The following script plots the expression of one gene at six time points:

```python
import matplotlib.pyplot as plt

# Expression values and the time points (minutes) at which they were measured.
time_points = [1, 2, 4, 8, 16, 32]
gene1_expression = [345, 365, 321, 456, 545, 510]

# subplots() returns the Figure and a single Axes.
fig, ax = plt.subplots()
# Draw a line through the points: x values first, then y values.
ax.plot(time_points, gene1_expression)
ax.set(xlabel="Time (mins)", ylabel="Gene expression")

# Save the figure to a file, then close it to free memory.
fig.savefig("first_plot.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

Open `first_plot.png` to see the result. `ax.set` sets several properties in
one call. `dpi=300` gives a high-resolution image, and `bbox_inches="tight"`
trims empty space so that labels are not cut off.

To display a figure in a window instead of saving it, finish with
`plt.show()`. The script pauses until you close the window. In this chapter,
save your figures to files: you can then compare versions, and you need the
files for your portfolio.

### Colours, markers, and line styles

The optional third argument to `plot` is a short **format string**. It
combines a colour letter with a marker and/or a line style:

| Colour | Meaning | Marker or line | Meaning |
|---|---|---|---|
| `b` | blue | `-` | solid line |
| `g` | green | `--` | dashed line |
| `r` | red | `-.` | dash-dot line |
| `c` | cyan | `:` | dotted line |
| `m` | magenta | `.` | point marker |
| `y` | yellow | `o` | circle marker |
| `k` | black | `x` | x marker |
| `w` | white | `s` | square marker |

For example, `"gx"` draws green crosses with no line, and `"r--o"` draws a
red dashed line with circles at each point. The full list is in the
[`plot` documentation](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.plot.html).
For more control, use keyword arguments instead, such as
`color="tab:orange"`, `marker="o"`, `linestyle="--"`, and `linewidth=2`.

### Set properties one at a time

Instead of one `ax.set` call, you can call a separate method for each
property. Both approaches give the same result:

```python
import matplotlib.pyplot as plt

time_points = [1, 2, 4, 8, 16, 32]
gene1_expression = [345, 365, 321, 456, 545, 510]

fig, ax = plt.subplots()
# Green line with circle markers.
ax.plot(time_points, gene1_expression, "g-o")
# Each property has its own set_ method.
ax.set_xlabel("Time (mins)")
ax.set_ylabel("Gene expression")
ax.set_title("Gene 1 expression over time")
# Start the y axis at zero so that changes are not exaggerated.
ax.set_ylim(0, 1000)

fig.savefig("gene1_green.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

The [`Axes` documentation](https://matplotlib.org/stable/api/axes_api.html)
lists every plot type and property that an `Axes` provides.

### Plot several lines on one `Axes`

Each call to `plot` adds another line to the same `Axes`. Give each line a
`label`, then call `legend` to show which line is which:

```python
import matplotlib.pyplot as plt

time_points = [1, 2, 4, 8, 12, 16]
gene1_expression = [345, 365, 321, 456, 545, 510]
gene2_expression = [445, 465, 426, 465, 476, 456]
gene3_expression = [123, 234, 454, 654, 543, 323]

fig, ax = plt.subplots()
# Each call adds a line. matplotlib chooses a new colour for each one.
ax.plot(time_points, gene1_expression, label="gene1")
ax.plot(time_points, gene2_expression, label="gene2")
ax.plot(time_points, gene3_expression, label="gene3")
ax.set_xlabel("Time (mins)")
ax.set_ylabel("Gene expression")
# Show the labels in a key.
ax.legend()

fig.savefig("three_genes.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

### Question 1: Plot gene expression over time

Write `q1.py` to plot `gene1` and `gene3` from the example above on the same
`Axes`. Use a different colour, marker, and line style for each gene, add a
legend and a title, and set the y axis to run from 0 to 800. Save the figure
as `q1_line_plot.png` at 300 DPI. Then try `ax.set_xscale("log", base=2)` and
explain in a comment why a log scale might suit these time points.

## Compare distributions with box and violin plots

<iframe title="Box plots, violin plots, and histograms" width="560" height="315" src="https://www.youtube.com/embed/f9bnN1gD7wQ" loading="lazy" allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A line plot shows how one value changes. To compare the **spread** of values
in several groups, use a box plot or violin plot. Both take a list of lists,
with one inner list per group:

```python
import matplotlib.pyplot as plt

# Repeated expression measurements for three genes.
gene1_data = [345, 365, 321, 456, 545, 510, 546, 456, 678, 566, 567, 543, 566, 867, 432, 546, 677]
gene2_data = [445, 465, 426, 465, 476, 456, 476, 434, 435, 476, 345, 456, 471, 453, 433, 456, 487]
gene3_data = [123, 234, 454, 654, 543, 323, 232, 345, 567, 543, 456, 432, 786, 453, 467, 321, 887]
# One inner list per box.
data_to_plot = [gene1_data, gene2_data, gene3_data]
gene_names = ["gene1", "gene2", "gene3"]

fig, ax = plt.subplots()
ax.boxplot(data_to_plot)
# Boxes are drawn at x = 1, 2, 3. Replace those numbers with gene names.
ax.set_xticks([1, 2, 3], gene_names)
ax.set(xlabel="Gene", ylabel="Gene expression", ylim=[0, 1000])

fig.savefig("boxplot.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

The box runs from the lower to the upper quartile, with a line at the median.
The whiskers extend to the furthest points within 1.5 times the interquartile
range, and any points beyond them are drawn individually as possible
outliers.

A violin plot shows the estimated shape of each distribution. This can reveal
features that a box plot hides, such as two separate peaks. Only the plotting
call changes:

```python
import matplotlib.pyplot as plt

gene1_data = [345, 365, 321, 456, 545, 510, 546, 456, 678, 566, 567, 543, 566, 867, 432, 546, 677]
gene2_data = [445, 465, 426, 465, 476, 456, 476, 434, 435, 476, 345, 456, 471, 453, 433, 456, 487]
gene3_data = [123, 234, 454, 654, 543, 323, 232, 345, 567, 543, 456, 432, 786, 453, 467, 321, 887]
data_to_plot = [gene1_data, gene2_data, gene3_data]

# figsize is (width, height) in inches.
fig, ax = plt.subplots(figsize=(6, 6))
# showmedians adds a line at each median.
ax.violinplot(data_to_plot, showmedians=True)
ax.set_xticks([1, 2, 3], ["gene1", "gene2", "gene3"])
ax.set_xlabel("Gene")
ax.set_ylabel("Gene expression")
ax.set_ylim(0, 1000)

fig.savefig("violin_genes.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

### Question 2: Box and violin plots

Write `q2.py` to draw the three genes as a box plot and, in a separate
figure, as a violin plot. Save them as `q2_boxplot.png` and
`q2_violinplot.png`. Label the genes on the x axis and give each figure a
title. Add a comment describing one thing the violin plot shows about `gene3`
that the box plot does not.

## Change the look with styles

matplotlib includes **styles** that change colours, fonts, grid lines, and
backgrounds together. List them with `plt.style.available`. To use a style for
one figure only, create the figure inside a `with plt.style.context(...)`
block:

```python
import matplotlib.pyplot as plt

gene1_data = [345, 365, 321, 456, 545, 510, 546, 456, 678, 566, 567, 543, 566, 867, 432, 546, 677]
gene2_data = [445, 465, 426, 465, 476, 456, 476, 434, 435, 476, 345, 456, 471, 453, 433, 456, 487]
gene3_data = [123, 234, 454, 654, 543, 323, 232, 345, 567, 543, 456, 432, 786, 453, 467, 321, 887]
data_to_plot = [gene1_data, gene2_data, gene3_data]

# Print the names of the built-in styles.
print(plt.style.available)

# The style applies only to figures created inside this block.
with plt.style.context("Solarize_Light2"):
    fig, ax = plt.subplots(figsize=(6, 6))
    ax.violinplot(data_to_plot)
    ax.set_xticks([1, 2, 3], ["gene1", "gene2", "gene3"])
    ax.set_xlabel("Gene")
    ax.set_ylabel("Gene expression")
    ax.set_ylim(0, 1000)
    fig.savefig("violin_genes_Solarize_Light2.png", dpi=300, bbox_inches="tight")
    plt.close(fig)
```

`plt.style.use("ggplot")` also works, but it changes the style for every
figure that the rest of the script creates. The `seaborn-v0_8-...` styles
were called `seaborn-...` in older versions of matplotlib, so older examples
online may use names that no longer work. The
[customisation tutorial](https://matplotlib.org/stable/users/explain/customizing.html)
explains how styles work and how to write your own.

### Question 3: Try every style

Write `q3.py` that loops over `plt.style.available` and saves the violin plot
above once in each style, as `styles/violin_<style>.png`. Create the `styles`
folder from Python with `os.makedirs("styles", exist_ok=True)`. Close each
figure after saving it: matplotlib warns if more than 20 figures are open at
once. Print how many files were written, then choose the style you would use
in a report and say why in a comment. Consider how the figure would look in
greyscale and to a reader with colour-vision deficiency.

## Plot data from a file

`peptide_small.csv` contains peptide identifications from a proteomics
experiment on *Arabidopsis thaliana*, exported from the PEAKS search engine.
Each row is one peptide-spectrum match. The columns used in this chapter are:

| Index | Column | Meaning |
|---|---|---|
| 0 | `Peptide` | Peptide sequence, with modifications in brackets, e.g. `M(+15.99)` |
| 1 | `-10lgP` | Identification score, −10 × log₁₀(*p*). Higher is better: 20 means *p* = 0.01. |
| 2 | `Mass` | Peptide mass (Da) |
| 3 | `Length` | Number of amino acids |
| 4 | `ppm` | Difference between measured and expected mass, in parts per million |
| 6 | `RT` | Retention time: when the peptide left the chromatography column (minutes) |
| 10 | `Accession` | Matched protein. `#DECOY#` marks a match to a reversed, fake sequence. |

Open the file in a text editor or spreadsheet to see all 36 columns. Many of
the `Area` columns are empty. Because no field contains a comma, each line
can be split on commas, as in earlier weeks.

The decoy rows matter. Search engines also search a database of fake
(decoy) sequences. Decoy matches are known to be wrong, so their scores show
what a random match looks like. Real (target) matches with scores well above
the decoys are likely to be correct.

### Draw a histogram

A **histogram** counts how many values fall into each of a set of equal-width
ranges, or **bins**. The following script reads the score column into a list
and plots it:

```python
import matplotlib.pyplot as plt

scores = []  # -10lgP score for every peptide
with open("peptide_small.csv") as f:
    f.readline()  # Read and ignore the header row.
    for line in f:
        values = line.strip().split(",")
        scores.append(float(values[1]))

print("Peptides read:", len(scores))

fig, ax = plt.subplots()
# Divide the range of scores into 50 bins and count the values in each.
ax.hist(scores, bins=50, color="g")
ax.set_xlabel("Identification score (-10lgP)")
ax.set_ylabel("Number of peptides")

fig.savefig("score_histogram.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

The y axis shows counts. If you pass `density=True` to `hist`, the bars are
scaled so that their total area is 1, and the y axis label should then be
"Density". The [`hist`
documentation](https://matplotlib.org/stable/api/_as_gen/matplotlib.axes.Axes.hist.html)
describes other options, such as `alpha` for transparency and `histtype`.

### Question 4: Compare target and decoy scores

Write `q4.py` to read the scores into two lists: one for target peptides and
one for decoys (where the accession contains `#DECOY#`). Print the number in
each list, the highest decoy score, and how many targets and decoys score at
least 20. Plot both on the same `Axes` as overlapping histograms with the
same bins (for example `bins=range(0, 125, 2)`), using `alpha=0.5` and a
legend. Save the figure as `q4_score_histogram.png`. Then add a dashed
vertical line with `ax.axvline(20, color="k", linestyle="--")`. In a comment,
describe where the decoy scores lie and explain why a score threshold is used
to choose which identifications to trust.

## Build multi-panel figures

<iframe title="Multi-panel figures and saving" width="560" height="315" src="https://www.youtube.com/embed/xxTCk9pB52g" loading="lazy" allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

`plt.subplots` can create several `Axes` in one figure. Give it the number of
rows and columns:

```python
import matplotlib.pyplot as plt

# One Axes: by convention, call it ax.
fig, ax = plt.subplots()
plt.close(fig)

# Several Axes: by convention, call them axs.
fig, axs = plt.subplots(2, 2)
print(axs.shape)
plt.close(fig)
```

With one row or one column, `axs` behaves like a list: `axs[0]`, `axs[1]`,
and so on. With several rows **and** columns, it is two-dimensional, so you
need a row and a column: `axs[0, 0]` is the top left and `axs[1, 1]` is the
bottom right. This is a common source of errors.

| Layout | Call | Access each `Axes` |
|---|---|---|
| 3 rows, 1 column | `plt.subplots(3, 1)` | `axs[0]`, `axs[1]`, `axs[2]` |
| 1 row, 3 columns | `plt.subplots(1, 3)` | `axs[0]`, `axs[1]`, `axs[2]` |
| 2 rows, 2 columns | `plt.subplots(2, 2)` | `axs[0, 0]`, `axs[0, 1]`, `axs[1, 0]`, `axs[1, 1]` |

In a column of plots, use a loop to draw one gene in each panel. `enumerate`
gives the position of each item as well as the item:

```python
import matplotlib.pyplot as plt

time_points = [1, 2, 4, 8, 12, 16]
datasets = [
    [345, 365, 321, 456, 545, 510],
    [445, 465, 426, 465, 476, 456],
    [123, 234, 454, 654, 543, 323],
]
colours = ["r-", "g-", "b-"]

# Three rows and one column. figsize is (width, height) in inches.
# sharex=True gives every panel the same x axis.
fig, axs = plt.subplots(3, 1, figsize=(4, 9), sharex=True)
for i, dataset in enumerate(datasets):
    axs[i].plot(time_points, dataset, colours[i], label="gene" + str(i + 1))
    axs[i].set_ylabel("Gene expression")
    axs[i].legend()
# Only the bottom panel needs an x axis label.
axs[2].set_xlabel("Time (mins)")

fig.savefig("three_lineplot_genes.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

For a grid, loop over the rows and then the columns:

```python
import matplotlib.pyplot as plt

time_points = [1, 2, 4, 8, 12, 16]
datasets = [
    [345, 365, 321, 456, 545, 510],
    [445, 465, 426, 465, 476, 456],
    [123, 234, 454, 654, 543, 323],
    [126, 237, 454, 659, 548, 324],
]
colours = ["r-", "g-", "b-", "c-"]

# layout="constrained" stops labels from overlapping neighbouring panels.
fig, axs = plt.subplots(2, 2, figsize=(7, 6), layout="constrained")
i = 0  # Position in the datasets list.
for row in range(2):
    for col in range(2):
        ax = axs[row, col]
        ax.plot(time_points, datasets[i], colours[i], label="gene" + str(i + 1))
        ax.set_xlabel("Time (mins)")
        ax.set_ylabel("Gene expression")
        ax.legend()
        i = i + 1

fig.savefig("four_lineplot_genes_2_2.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

Any extra keyword arguments to `plt.subplots`, such as `figsize`, `dpi`, and
`layout`, are passed on to the `Figure`. See the [`subplots`
documentation](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.subplots.html).
Older examples use `tight_layout=True` for the same purpose as
`layout="constrained"`.

### Save figures for reports

`fig.savefig` chooses the file format from the extension:

```text
fig.savefig("figure.png", dpi=300, bbox_inches="tight")   # Image for slides or Word
fig.savefig("figure.pdf", bbox_inches="tight")            # Vector file for reports
fig.savefig("figure.svg", bbox_inches="tight")            # Vector file you can edit
```

PNG is an image made of pixels, so set `dpi` to 300 for a sharp result in a
printed report. PDF and SVG are vector formats: lines and text stay sharp at
any size. Other useful options include `transparent=True` and `facecolor`.

### Question 5: A multi-panel summary of the peptide data

Write `q5.py` to create a 2 × 2 figure of histograms for the target peptides
(not decoys) with a score of at least 20. Show `Mass`, `Length`, `ppm`, and
`RT`, with one column in each panel. Store the column indexes and names in two
lists and use a loop so that you do not repeat the plotting code four times.
Give each panel an x axis label with units and add an overall title with
`fig.suptitle(...)`. Save the figure as both `q5_peptide_panels.png` and
`q5_peptide_panels.pdf`. Compare the `ppm` panel with what you would expect
from an accurate mass spectrometer.

## Work with numpy arrays

<iframe title="numpy arrays and linear regression" width="560" height="315" src="https://www.youtube.com/embed/bVU-gP0bdWA" loading="lazy" allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

So far, you have passed lists to matplotlib. Internally, matplotlib converts
them to **arrays** from the `numpy` library, the basis of most scientific
computing in Python.

A numpy array is like a list, with three important differences:

- every element has the **same data type**, such as all integers or all
  floating-point numbers
- its size is fixed when it is created
- arithmetic applies to **every element at once**, without a loop.

For small tasks, lists and dictionaries are fine. For large amounts of
numerical data, arrays use less memory, are much faster, and have many useful
functions.

### Create arrays

```python
import numpy as np

# Create an array from a list.
a = np.array([2, 3, 4])
print(a)
print("Data type:", a.dtype)

# A list of tuples or lists makes a two-dimensional array.
two_d_array = np.array([(1.5, 2, 3), (4, 5, 6)])
print(two_d_array)
print("Shape (rows, columns):", two_d_array.shape)
print("Data type:", two_d_array.dtype)
```

The output is:

```text
[2 3 4]
Data type: int64
[[1.5 2.  3. ]
 [4.  5.  6. ]]
Shape (rows, columns): (2, 3)
Data type: float64
```

The second array is printed with a dot after every number. Because one
element (`1.5`) is a floating-point number and every element must have the
same type, numpy converts all of them to floats. On Windows, the integer type
may be shown as `int32` instead of `int64`.

To create evenly spaced values, use `np.arange(start, stop, step)` or
`np.linspace(start, stop, number_of_values)`:

```python
import numpy as np

# Values from 0 up to, but not including, 5, in steps of 0.5.
a = np.arange(0, 5, 0.5)
print(a)

# Exactly 5 values from 0 to 1, including both ends.
b = np.linspace(0, 1, 5)
print(b)
```

```text
[0.  0.5 1.  1.5 2.  2.5 3.  3.5 4.  4.5]
[0.   0.25 0.5  0.75 1.  ]
```

As with `range`, `arange` stops before the stop value. With a decimal step,
`linspace` is safer, because rounding can make `arange` include or exclude the
last value unexpectedly.

### Calculate with whole arrays

Arithmetic applies to each element. With two arrays of the same length, the
operation pairs up elements in the same positions:

```python
import numpy as np

a = np.array([2, 3, 4])
b = np.array([10, 100, 1000])

print(a * b)     # Multiply paired elements.
print(a ** 3)    # Cube every element.
print(a + 1)     # Add 1 to every element.

# Summary functions work on the whole array.
print("Sum:", a.sum(), "Mean:", a.mean(), "Max:", a.max())
```

```text
[  20  300 4000]
[ 8 27 64]
[3 4 5]
Sum: 9 Mean: 3.0 Max: 4
```

With a list, `[2, 3, 4] * 2` repeats the list, giving `[2, 3, 4, 2, 3, 4]`. With
an array, it doubles every value. Check which type you have when a result
looks wrong.

### Index, slice, and filter arrays

One-dimensional arrays are indexed and sliced like lists. You can also loop
over them:

```python
import numpy as np

a = np.array([2, 3, 14, 23, 43, 23])
print(a[0])      # First element
print(a[4:6])    # Elements at positions 4 and 5
for value in a:
    print("Num:", value)
```

A two-dimensional array is indexed by `[row, column]`. A `:` selects a whole
row or column:

```python
import numpy as np

# Three samples (rows) of four genes (columns).
expression = np.array([
    (265, 331, 276, 456),
    (276, 328, 281, 543),
    (301, 333, 291, 654),
])
print(expression)
print("Row 1, column 2:", expression[1, 2])
print("All of column 3:", expression[:, 3])
# axis=0 calculates down the columns: one mean per gene.
print("Mean of each column:", expression.mean(axis=0))
```

```text
[[265 331 276 456]
 [276 328 281 543]
 [301 333 291 654]]
Row 1, column 2: 281
All of column 3: [456 543 654]
Mean of each column: [280.66666667 330.66666667 282.66666667 551.        ]
```

Rows and columns are numbered from 0, so `expression[1, 2]` is in the second
row and third column. `expression[1][2]` gives the same value, but
`[1, 2]` is the usual numpy form.

A comparison such as `a > 10` produces an array of `True` and `False` values.
Use it inside square brackets to keep only the matching elements. This is
called **Boolean indexing**:

```python
import numpy as np

a = np.array([2, 3, 14, 23, 43, 23])
is_large = a > 10
print(is_large)
print(a[is_large])
print("Values above 10:", is_large.sum())
```

```text
[False False  True  True  True  True]
[14 23 43 23]
Values above 10: 4
```

`True` counts as 1, so `sum` counts the matching values. The
[numpy quickstart](https://numpy.org/doc/stable/user/quickstart.html) covers
these ideas in more detail.

### Question 6: Analyse peptide data with arrays

Write `q6.py` to read the `-10lgP`, `Mass`, and `ppm` columns into three numpy
arrays (read them into lists first, then convert them with `np.array`). Do
not use a loop after the arrays are created. Use Boolean indexing to:

1. print the mean, median (`np.median`), and standard deviation (`.std()`) of
   the masses of peptides with a score of at least 20
2. count how many peptides have a mass error larger than 5 ppm in either
   direction (`np.abs` gives absolute values)
3. compare the mean absolute mass error of peptides scoring at least 50 with
   that of peptides scoring below 20, and suggest a reason for the
   difference.

Then make a 2D array of the four genes from the 2 × 2 example above, with one
row per gene. Divide every row by its value at the first time point to show
the fold change, and print the result rounded with `np.round(..., 2)`.
Hint: `array[:, 0:1]` keeps the first column as a column, so it can divide
every row.

## Correlate two columns with a regression line

A **scatter plot** shows whether two measurements are related. Larger
peptides are often more hydrophobic and elute later from the chromatography
column, so peptide mass and retention time may be correlated.
`scipy.stats.linregress` fits a straight line, *y* = *mx* + *b*, through the
points:

```python
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

masses = []
retention_times = []
with open("peptide_small.csv") as f:
    f.readline()  # Skip the header row.
    for line in f:
        values = line.strip().split(",")
        score = float(values[1])
        # Keep only confident identifications.
        if score > 50:
            masses.append(float(values[2]))
            retention_times.append(float(values[6]))

# Convert to arrays so that the fitted line can be calculated in one step.
mass = np.array(masses)
rt = np.array(retention_times)
print("Peptides plotted:", len(mass))

# Fit y = slope * x + intercept.
fit = stats.linregress(mass, rt)
print(f"slope = {fit.slope:.4f}, intercept = {fit.intercept:.2f}")
print(f"r = {fit.rvalue:.3f}, r squared = {fit.rvalue ** 2:.3f}, p = {fit.pvalue:.2g}")

fig, ax = plt.subplots()
# Small, semi-transparent points make dense regions visible.
ax.plot(mass, rt, "ro", markersize=3, alpha=0.3)
# Calculate y for every mass at once and draw the fitted line.
ax.plot(mass, fit.slope * mass + fit.intercept, "k-")
ax.set_xlabel("Peptide mass (Da)")
ax.set_ylabel("Retention time (mins)")
ax.set_title(f"Mass vs retention time, $r^2$ = {fit.rvalue ** 2:.3f}")

fig.savefig("scatter_with_line.png", dpi=300, bbox_inches="tight")
plt.close(fig)
```

`linregress` returns the `slope`, the `intercept`, `rvalue` (the Pearson
correlation coefficient, *r*), `pvalue` (for the test that the slope is zero),
and `stderr` (the standard error of the slope). *r*² is the proportion of the
variation in *y* explained by the line. Here *r*² is about 0.2. The
relationship is very unlikely to be due to chance, because the *p*-value is
tiny, but mass explains only a small part of the variation in retention time.

`ax.scatter(x, y)` is an alternative to `ax.plot(x, y, "o")`. It can also
colour or size each point by a third value, for example
`ax.scatter(mass, rt, c=scores, s=5)` followed by `fig.colorbar(...)`.

### Question 7: Correlate peptide properties

Write `q7.py` to reproduce the mass and retention time plot above, saving it
as `q7_mass_vs_rt.png`. Then plot `Length` (x) against `Mass` (y) for the same
peptides, fit a regression line, and save it as `q7_length_vs_mass.png`.
Print *r*² and the slope for each fit. In a comment, explain why the
length–mass correlation is much stronger, and what the slope means in
biological terms. Finally, make a third figure, `q7_mass_vs_rt_length.png`,
with `ax.scatter` for the same mass and retention time data, colouring each
point by peptide length (`c=lengths`) and adding a colour bar with
`fig.colorbar(points, ax=ax, label="Length (amino acids)")`, where `points`
is the value returned by `ax.scatter`.

### Question 8: Plot conservation along an alignment

In Week 9, Question 4, you wrote functions that score the conservation and
occupancy of each alignment column. Write `q8.py` to read
`../week-9/human_mapk_aligned.fasta` and make a list with one value for every
column: the conservation score if the occupancy is at least 0.5, and
otherwise `float("nan")` ("not a number"). matplotlib leaves a break in the
line wherever a value is `nan`, so gap-rich columns are not joined up. Plot
the scores (y) against the 1-based alignment position (x) as a line plot. Add
a dashed horizontal line at 0.9 with `ax.axhline`, label the axes, set the y
axis from 0 to 1.05, and make the figure wide, for example
`figsize=(12, 4)`. Save it as `q8_conservation_plot.png`. Describe in a
comment which regions are most conserved and how the plot helps you see this
compared with the top 10 list you printed in Week 9.

For an extra challenge, add a second line showing the average score over a
sliding window of 15 columns, which makes conserved regions easier to see
than single columns.

## Bring the week together

This week, you have:

- created figures with `plt.subplots` and drawn on their `Axes`
- chosen plot types to suit the question: lines for change over time, box
  and violin plots for distributions, histograms for frequencies, and scatter
  plots for relationships
- arranged several plots in one figure and saved high-resolution PNG and PDF
  files
- used numpy arrays to calculate on whole datasets and to filter them
- fitted a linear regression with `scipy.stats.linregress`.

When you make a figure, ask what comparison the reader needs to see. Then
choose the plot type, label every axis with units, add a legend when there is
more than one dataset, and check that the figure still works in greyscale.

### Additional resources

- [matplotlib quick start guide](https://matplotlib.org/stable/users/explain/quick_start.html)
- [matplotlib plot types gallery](https://matplotlib.org/stable/plot_types/index.html)
- [numpy quickstart](https://numpy.org/doc/stable/user/quickstart.html)
- [scipy.stats.linregress](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.linregress.html)
- [Ten simple rules for better figures](https://doi.org/10.1371/journal.pcbi.1003833) (Rougier, Droettboom and Bourne, *PLOS Computational Biology*, 2014)

## Portfolio Project 3

Portfolio Project 3 asks you to plot conservation along an alignment of
likely orthologues and to save tree images. Question 8 practises the same
kind of plot, and this week's material on labels, sizes, and saving figures
applies to every plot in the project. Several of the project's optional
extensions also use this week's skills, such as a BLAST-score histogram, an
annotated conservation plot, or a multi-page PDF of plots. Follow the
[Project 3 instructions](../projects.md#project-3-a-biopython-orthologue-pipeline)
on the Portfolio Projects page. The submission deadline is given on Canvas.
