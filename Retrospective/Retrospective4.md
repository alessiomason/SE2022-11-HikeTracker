TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done (17 vs 17)
- Total points committed vs done (83 vs 83)
- Nr of hours planned vs spent (72,5 vs 74)

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    10     |    -   |     17       |      15,5        |
| _#17_|   4     |   13     |    3        |      3      |
| _#18_|   6      |     8   |    6,5        |     6,5       |
| _#34_|     1    |   3     |        1    |      1      |
| _#19_|    2    |   8     |      1,5      |     1,5       |
| _#35_|    1     |   2     |    0,5        |      0,5      |
| _#31_|   3      |     1   |    4        |     4       |
| _#32_|     2    |   3     |        2    |      2      |
| _#27_|    2    |   5     |      4      |     3       |
| _#29_|    1     |   3     |    2        |      2      |
| _#14_|   2      |     8   |    4        |     5       |
| _#30_|     0    |   1     |        0    |      0      |
| _#15_|    1    |   3     |      3      |     3       |
| _#12_|   3      |     2   |    5        |     5       |
| _#13_|     0    |   5     |        0    |      0    |
| _#10_|    4    |   5     |      10      |     10       |
| _#11_|    1     |   5     |    4        |      6      |
| _#16_|   2      |     8   |    5        |     5       |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)

| Estimated Average #0 | Estimated Average #17  | Estimated Average #18  | Estimated Average #34  | Estimated Average #19  | Estimated Average #35  |Estimated Average #31  |Estimated Average #32  |Estimated Average #27  |Estimated Average #29  |Estimated Average #14  |Estimated Average #30  |Estimated Average #15  |Estimated Average #12  |Estimated Average #13  |Estimated Average #10  |Estimated Average #11  |Estimated Average #16  | Estimated Average Total | Estimated Standard Deviation | 
|------|--------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|--------|------------|--------------| --------------|  
| 1,7 |  0,75  |    1,1    |   1    |   0,75    |   0,5    |   1,3    |   1    |   2    |   2    |   2    |   0    |   3    |   1,7    |   0    |   2,5    |    4        |    2,5        |   1,54      |  1,05  |

| Actual Average #0 | Actual Average #17  | Actual Average #18  | Actual Average #34  | Actual Average #19  | Actual Average #35  |Actual Average #31  |Actual Average #32  |Actual Average #27  |Actual Average #29  |Actual Average #14  |Actual Average #30  |Actual Average #15  |Actual Average #12  |Actual Average #13  |Actual Average #10  |Actual Average #11  |Actual Average #16  | Actual Average Total | Actual Standard Deviation | 
|------|--------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|---------|--------|------------|--------------| --------------|  
| 1,5 |  0,75  |    1,1    |   1    |   0,75    |   0,5    |   1,3    |   1    |   1,5    |   2    |   1,5    |   0    |   3    |   1,7    |   0    |   2,5    |    6        |    2,5        |   1,59      |  1,37  | 

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1 (72,5/74 -1 = -0.02)

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated (5)
  - Total hours spent (5)
  - Nr of automated unit test cases (50)
  - Coverage (if available)
- E2E testing:
  - Total hours estimated (1)
  - Total hours spent (1)
- Code review 
  - Total hours estimated (2)
  - Total hours spent (2)
- Technical Debt management:
  - Total hours estimated (3)
  - Total hours spent (3)
  - Hours estimated for remediation by SonarQube (48)
  - Hours estimated for remediation by SonarQube only for the selected and planned issues (3)
  - Hours spent on remediation (2)
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 0.7%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) A, A, A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?  
/

- What lessons did you learn (both positive and negative) in this sprint?  
How to organize our time to finish stories already started and how to prepare a final demo 

- Which improvement goals set in the previous retrospective were you able to achieve?  
Better coordination
- Which ones you were not able to achieve? Why?  
/
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)  
/

> Propose one or two

- One thing you are proud of as a Team!!  
Quiet work environment 