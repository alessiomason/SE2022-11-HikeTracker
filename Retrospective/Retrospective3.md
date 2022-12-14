TEMPLATE FOR RETROSPECTIVE (Team ##)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done (4 vs 1)
- Total points committed vs done (21 vs 8)
- Nr of hours planned vs spent (71,5 vs 62,5)

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Unit Tests passing
- Code review completed
- Code present on VCS
- End-to-End tests performed

> Please refine your DoD 

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|--------|---------|--------|------------|--------------|
| _#0_   |    11     |    -   |     25       |      23        |
| _#7_|    2     |   8     |    9        |      9      |
| _#8_|   3      |     5   |    11        |     9       |
| _#9_|     1    |   3     |        2    |      1      |
| _#33_|    1    |   5     |      6      |     6       |
   

> place technical tasks corresponding to story `#0` and leave out story points (not applicable in this case)

- Hours per task (average, standard deviation)

| Estimated Average #0 | Estimated Average #7  | Estimated Average #8  | Estimated Average #9  | Estimated Average #33  | Estimated Average Total | Estimated Standard Deviation | 
|------|--------|---------|--------|------------|--------------| --------------|
| 2,3 |  4,5  |    3,7    |   2    |    6        |   2,96      |  1,1  |

| Estimated Average #0 | Actual Average #7  | Actual Average #8  | Actual Average #9  | Actual Average #33  | Actual Average Total | Actual Standard Deviation |
|------|--------|---------|--------|------------|--------------| --------------|
|2,8| 4,5|  3,0   |   1     |  2   |    3,3     |  1,7      | 

- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent - 1 (71,5/62,5 -1 = -0.126)

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated (3)
  - Total hours spent (0)
  - Nr of automated unit test cases 21
  - Coverage (if available)
- E2E testing:
  - Total hours estimated (4)
  - Total hours spent (0)
- Code review 
  - Total hours estimated (2)
  - Total hours spent (2)
- Technical Debt management:
  - Total hours estimated (3)
  - Total hours spent (2)
  - Hours estimated for remediation by SonarQube (30)
  - Hours estimated for remediation by SonarQube only for the selected and planned issues (3)
  - Hours spent on remediation (2)
  - debt ratio (as reported by SonarQube under "Measures-Maintainability") 1.0%
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability ) A, A, A
  


## ASSESSMENT

- What caused your errors in estimation (if any)?  
One teammate was unable to work due to being sick so was unable to do the testing part and few bugs

- What lessons did you learn (both positive and negative) in this sprint?  
Better awareness of the team, how to use SonarQube

- Which improvement goals set in the previous retrospective were you able to achieve?  
Less bugs produced and code quality improvement by SonarCube
- Which ones you were not able to achieve? Why?  
/
- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)  
Better coordination

> Propose one or two

- One thing you are proud of as a Team!!  
Quiet work environment 