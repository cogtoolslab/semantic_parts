# semantic_parts
Our goal is to understand the semantic part structure of object sketches. 

## Developing part segmentation task on toy case

Milestones for part segmentation task interface:

1. Display: paper.js canvas environment that displays the sample smiley SVG, by reading in the cubic bezier curve segments.
2. Interactive 1: allows for highlighting by hovering/clicking particular strokes
3. Interactive 2: allows you to "paint in" only the subset of curve segments that you click and drag over, rather than entire stroke by default.
4. Interactive 3: class-conditional menu of labels appears after each "paint" operation (e.g., eye, mouth, head, Other).
  a. If "Other" is selected, text box appears to allow for free response.
5. Output: For each paint+annotation cycle, write out: painted SVG curve segments plus their semantic label. Once an SVG curve segment is painted and labeled once, it cannot be painted in again.

## Generalizing to a particular real object class

## Using part annotations to train a segmenter on held out objects within that class.
